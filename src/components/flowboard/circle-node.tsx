import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ id, positionAbsoluteX, positionAbsoluteY }: any) => {
    const label = `Position x:${Math.round(positionAbsoluteX)} y:${Math.round(positionAbsoluteY)}`;

    return (
        <div className="react-flow__node-circle">
            <div>{label || 'no node connected'}</div>
            <Handle
                type="target"
                position={Position.Left}
                className="custom-handle"
            />
        </div>
    );
});
