/*
- [x] Fix Code Viewer in GrapeJS Editor
    - [x] Locate code viewer component/plugin
    - [x] Diagnose empty/broken display issue
    - [x] Implement fix for code content display
    - [ ] Fix single-line display issue (enable line wrap/formatting)
    - [ ] Increase height of the viewer containers
The current code viewer in the editor is using the built-in GrapeJS `core:open-code` command, which appears to be displaying an empty dialog in the user's environment. We will replace this with a custom `CodeViewerDialog` that provides a better experience with syntax highlighting and formatting.

## Proposed Changes

### [GrapeJS Editor]

#### [MODIFY] [index.tsx](file:///c:/Users/TREV/Documents/Critical%20backups/website-builder-main/src/components/global/grapejs-editor/index.tsx)
- Import `CodeViewerDialog`.
- Add local state for controlling the dialog and storing the HTML/CSS content.
- Update `handleViewCode` to extract current HTML/CSS from the GrapeJS instance and open the custom dialog.
- Render the `CodeViewerDialog` component.

## Verification Plan

### Manual Verification
- Open the editor.
- Click "View Code".
- Verify that the dialog opens and displays formatted, highlighted HTML and CSS.
- Test "Copy" functionality.
- Test "Split View", "HTML Only", and "CSS Only" tabs.
*/
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        // Perform a simple query to keep the database active
        // We use supabaseAdmin to bypass RLS and ensure the query executes
        const { data, error } = await supabaseAdmin
            .from('User')
            .select('id')
            .limit(1)

        if (error) {
            console.error('Supabase heartbeat error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            status: 'ok',
            message: 'Heartbeat successful, Supabase is active.',
            timestamp: new Date().toISOString()
        })
    } catch (err) {
        console.error('Unexpected heartbeat error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
