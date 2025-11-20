import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import React from 'react'
import { v4 } from 'uuid'

type Props = {
  params: { subaccountId: string }
}

const Pipelines = async ({ params }: Props) => {
  // Get all pipelines for this subaccount
  const { data: allPipelines } = await supabase
    .from('Pipeline')
    .select('*')
    .eq('subAccountId', params.subaccountId)
    .order('createdAt', { ascending: false })

  console.log('🔍 All pipelines for subaccount:', allPipelines)

  // If pipelines exist, redirect to the most recent one
  if (allPipelines && allPipelines.length > 0) {
    const mostRecent = allPipelines[0]
    console.log('✅ Redirecting to existing pipeline:', mostRecent.id)
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${mostRecent.id}`
    )
  }

  // Create new pipeline if none exist
  try {
    console.log('🔧 No pipelines found, creating new one...')
    const newPipelineId = v4()
    const { data: response, error } = await supabase
      .from('Pipeline')
      .insert({ 
        id: newPipelineId,
        name: 'First Pipeline', 
        subAccountId: params.subaccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating pipeline:', error)
      return
    }

    console.log('✅ Created pipeline successfully:', response)
    
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${response.id}`
    )
  } catch (error) {
    console.log(error)
  }
}

export default Pipelines
