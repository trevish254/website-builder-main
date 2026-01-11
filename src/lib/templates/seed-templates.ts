/**
 * Template Seeding System
 * Seeds default templates into the database
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { createManufacturingTemplate } from './manufacturing-template'
import { createRenewableEnergyTemplate } from './renewable-energy-template'
import { createLegalTemplate } from './legal-template'
import { TemplateData } from './template-helpers'

/**
 * Seed a single template to the database
 */
async function seedTemplate(template: TemplateData, userId?: string): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('WebsiteTemplate')
            .insert({
                name: template.name,
                description: template.description,
                category: template.category,
                thumbnail: template.thumbnail || null,
                content: template.content,
                isPublic: template.isPublic,
                createdBy: userId || null
            })

        if (error) {
            console.error(`Error seeding template "${template.name}":`, error)
            return false
        }

        console.log(`✓ Successfully seeded template: ${template.name}`)
        return true
    } catch (error) {
        console.error(`Error seeding template "${template.name}":`, error)
        return false
    }
}

/**
 * Check if a template already exists
 */
async function templateExists(templateName: string): Promise<boolean> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('WebsiteTemplate')
            .select('id')
            .eq('name', templateName)
            .single()

        return !error && !!data
    } catch {
        return false
    }
}

/**
 * Seed all default templates
 */
export async function seedDefaultTemplates(userId?: string): Promise<{
    success: boolean
    seeded: number
    skipped: number
    errors: number
}> {
    console.log('=== Seeding Default Templates ===')

    const templates: TemplateData[] = [
        createManufacturingTemplate(),
        createRenewableEnergyTemplate(),
        createLegalTemplate()
        // Add more templates here as they're created
    ]

    let seeded = 0
    let skipped = 0
    let errors = 0

    for (const template of templates) {
        // Check if template already exists
        const exists = await templateExists(template.name)

        if (exists) {
            console.log(`⊘ Template "${template.name}" already exists, skipping...`)
            skipped++
            continue
        }

        // Seed the template
        const success = await seedTemplate(template, userId)

        if (success) {
            seeded++
        } else {
            errors++
        }
    }

    console.log('=== Seeding Complete ===')
    console.log(`Seeded: ${seeded}, Skipped: ${skipped}, Errors: ${errors}`)

    return {
        success: errors === 0,
        seeded,
        skipped,
        errors
    }
}

/**
 * Remove all default templates (for testing)
 */
export async function removeDefaultTemplates(): Promise<boolean> {
    try {
        const supabase = await createClient()

        const templateNames = [
            'Manufacturing Excellence'
            // Add more template names here
        ]

        const { error } = await supabase
            .from('WebsiteTemplate')
            .delete()
            .in('name', templateNames)

        if (error) {
            console.error('Error removing templates:', error)
            return false
        }

        console.log('✓ Successfully removed default templates')
        return true
    } catch (error) {
        console.error('Error removing templates:', error)
        return false
    }
}
