import { ICollider, Ray, rayIntersection as lineIntersecton } from "../../util/Collider";
import Game from "../../util/Game";
import Vector2 from "../../util/Vector2";
import IGameObject from "../IGameObject";
import Powerup from "./Powerup";

export enum EffectType {
    Cage = "The ball is trapped!", //creates cage around ball for 3 seconds
    BlackHole = "A black hole has appeared in the goal!", //adds gravity towards opponent goal
    DefensiveWall = "That's not fair...", //creates wall behind ball where powerup was picked up for 3 seconds
    Invisiball = "Where did it go?", //makes ball invisible for 1 second
    DoubleBall = "This is getting out of hand. Now there are two of them!", //creates second ball for 5 seconds
}

abstract class Effect implements IGameObject {
    game: Game;
    type: EffectType;
    origin: Vector2;
    durationMs: number; //60 FPS

    constructor(game: Game, origin: Vector2, type: EffectType, durationMs: number) {
        this.game = game;
        this.origin = origin;
        this.type = type;
        this.durationMs = durationMs;
    }

    update(dt: number): void {
        throw new Error("Method not implemented.");
    }

    abstract onStart(ownerIsLeft: boolean): void;
    abstract onEnd(ownerIsLeft: boolean): void;
}
export default Effect;

namespace Effect {
    type Constructor<T> = {
        new(game: Game, origin: Vector2): T;
        readonly prototype: T;
    }

    const implementations: Constructor<Effect>[] = [];
    export function GetImplementations(): Constructor<Effect>[] {
        return implementations;
    }
    export function register<T extends Constructor<Effect>>(ctor: T) {
        console.log("FIRE FIRE FIRE FIRE FIRE");
        implementations.push(ctor);
        return ctor;
    }
}