import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { BaseNode, BaseNodeContent, BaseNodeHeader, BaseNodeHeaderTitle } from './base-node';

function DebugNode({ data }: { data: any }) {
    return (
        <BaseNode className="w-64">
            <BaseNodeHeader>
                <BaseNodeHeaderTitle>Debug Node</BaseNodeHeaderTitle>
            </BaseNodeHeader>
            <BaseNodeContent>
                <div className="text-sm text-muted-foreground">
                    {data.label || 'This is a debug node using BaseNode'}
                </div>
            </BaseNodeContent>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </BaseNode>
    );
}

export default memo(DebugNode);
