import * as PIXI from "pixi.js";
import "@pixi/graphics-extras";

import Wall from "../shared/game_objects/Wall";
import IDrawable from "./IDrawable";
import Drawable from "./Drawable";
import Vector2 from "../shared/util/Vector2";
import addKeyListeners from "../shared/util/Interaction";
import { ICollider, Ray } from "../shared/util/Collider";
import IGameObject from "../shared/game_objects/IGameObject";

export default class WallDrawable extends Drawable implements IGameObject, ICollider {
    private wall: Wall;
    private color: number;

    constructor(app: PIXI.Application, x: number,
        y: number,
        width: number,
        height: number,
        side: "top" | "bot" | "left" | "right" = "bot",
        color = 0x496085
    ) {
        super(app, true);
        this.wall = new Wall(x, y, width, height, side);
        this.color = color;




        // app.ticker.add((delta) => {
        //     this.wall.update(delta);
        // });
    }
    wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
        return this.wall.wouldPointCollide(oldPos, newPos);
    }
    intersectRay(ray: Ray): Vector2 | null {
        return this.wall.intersectRay(ray);
    }
    onCollision(collidingObject: any): Vector2 {
        return this.wall.onCollision(collidingObject);
    }
    normal(incoming: Vector2): Vector2 {
        return this.wall.normal(incoming);
    }
    update(dt: number): void {
        this.wall.update(dt);
    }

    public get pos(): Vector2 {
        return this.wall.pos;
    }
    public get width(): number {
        return this.wall.width;
    }
    public get height(): number {
        return this.wall.height;
    }
    public get colliderSide(): string {
        return this.wall.colliderSide;
    }
    public get colliderRay(): Ray {
        return this.wall.colliderRay;
    }


    public redraw() {
        this.gfx!.clear();
        this.gfx!.beginFill(this.color)
            .drawRect(this.pos.x, this.pos.y, this.width, this.height)
            .endFill();

        if (globalThis.debugMode) {
            const line_width = 10;
            const rotation_dir =
                this.colliderSide === "right" || this.colliderSide === "top"
                    ? Math.PI / 2
                    : -Math.PI / 2;
            const col_start = this.colliderRay.pos.add(
                this.colliderRay.dir
                    .normalized()
                    .scale(line_width / 2)
                    .rotate(rotation_dir)
            );
            const col_end = this.colliderRay.dir.add(col_start);
            this.gfx!.moveTo(col_start.x, col_start.y)
                .lineStyle(line_width, 0xfcdb03)
                .lineTo(col_end.x, col_end.y)
                .endFill();
        }
    }
}