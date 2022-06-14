import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import { ICollider, Ray, rayIntersection } from "../util/Collider";
import Vector2 from "../util/Vector2";

class Wall implements ICollider {
  pos: Vector2;
  height: number;
  width: number;

  color: number;

  colliderRay: Ray;

  colliderSide: "top" | "bot" | "left" | "right";

  private _gfx: Graphics;
  private _app: PIXI.Application;

  constructor(
    app: PIXI.Application,
    x: number,
    y: number,
    width: number,
    height: number,
    side: "top" | "bot" | "left" | "right" = "bot",
    color = 0x496085
  ) {
    this.pos = new Vector2(x, y);
    this.height = height;
    this.width = width;
    this.color = color;
    this.colliderSide = side;

    this._gfx = new Graphics();
    this._app = app;

    app.stage.addChild(this._gfx);

    switch (side) {
      case "top":
        this.colliderRay = new Ray(new Vector2(x, y), new Vector2(width, 0));
        break;
      case "bot":
        this.colliderRay = new Ray(
          new Vector2(x, y + height),
          new Vector2(width, 0)
        );
        break;
      case "left":
        this.colliderRay = new Ray(new Vector2(x, y), new Vector2(0, height));
        break;
      case "right":
        this.colliderRay = new Ray(
          new Vector2(x + width, y),
          new Vector2(0, height)
        );
        break;
      default:
        this.colliderRay = new Ray(this.pos.clone(), new Vector2(x + width, y));
        break;
    }
  }

  public redraw() {
    this._gfx.clear();
    this._gfx
      .beginFill(this.color)
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
      this._gfx
        .moveTo(col_start.x, col_start.y)
        .lineStyle(line_width, 0xfcdb03)
        .lineTo(col_end.x, col_end.y)
        .endFill();
    }
  }

  private update(delta: number) {
    this.redraw();
  }

  public intersectRay(ray: Ray): Vector2 | null {
    const inter = rayIntersection(this.colliderRay, ray);

    if (!inter) return null;

    const distanceFromStart = inter.subtract(this.colliderRay.pos).norm();
    if (
      distanceFromStart >= 0 &&
      distanceFromStart < this.colliderRay.dir.norm()
    )
      return inter;
    return null;
  }

  public normal(incoming: Vector2): Vector2 {
    let normal = this.colliderRay.dir.rotate(Math.PI / 2).normalized();
    if (normal.dot(incoming) > 0) {
      normal = normal.rotate(Math.PI);
    }
    return normal;
  }

  public onCollision(collidingObject: any): void {
    // console.log("Collided with wall");

    const normal = this.normal(collidingObject.velocity).scale(1);
    const v = collidingObject.velocity;
    const angle = Math.atan2(normal.cross(v), v.dot(normal)) * 2;

    collidingObject.velocity = collidingObject.velocity.rotate(
      -angle + Math.PI
    );
    collidingObject.velocity = collidingObject.velocity.scale(0.8); // Loose energy on bounce
  }

  public wouldPointCollide(oldPos: Vector2, newPos: Vector2): boolean {
    const crossOld = this.colliderRay.pos
      .subtract(oldPos)
      .cross(this.colliderRay.dir);
    const crossNew = this.colliderRay.pos
      .subtract(newPos)
      .cross(this.colliderRay.dir);

    if ((crossNew >= 0 && crossOld >= 0) || (crossNew <= 0 && crossOld <= 0))
      return false;
    return true;
  }
}

export default Wall;
