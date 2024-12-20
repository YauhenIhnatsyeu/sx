import { IconType } from '../types';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
    type: IconType;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Icon = ({ type, className, onClick }: Props) => {
    const [icon, setIcon] = useState<ReactNode>(null);

    useEffect(() => {
        import(`../assets/icons/${type}.svg`).then((module) => setIcon(module.default));
    }, [type]);

    if (!icon || typeof icon !== 'string') {
        return;
    }

    return (
        <i className={(className ?? '') + (onClick ? ' clickable' : '')} onClick={onClick}>
            <img src={icon} />
        </i>
    );
};
