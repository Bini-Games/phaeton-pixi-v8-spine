import type { Skeleton } from './Skeleton';
import type { Color, Vector2 } from '@pixi-v8-patch-spine/base';

/**
 * @public
 */
export interface VertexEffect {
    begin(skeleton: Skeleton): void;
    transform(position: Vector2, uv: Vector2, light: Color, dark: Color): void;
    end(): void;
}
