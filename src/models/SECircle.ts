import { SENodule } from "./SENodule";
import { SEPoint } from "./SEPoint";
import Circle from "@/plottables/Circle";
import { Vector3 } from "three";
import { Visitable } from "@/visitors/Visitable";
import { Visitor } from "@/visitors/Visitor";
let CIRCLE_COUNT = 0;
import SETTINGS from "@/global-settings";

export class SECircle extends SENodule implements Visitable {
  public ref!: Circle;
  private normalDir: Vector3;
  private center: SEPoint;
  private radius: number; // Arc length (in radians) not straight line distance
  // private center!: SEPoint;
  // private point!: SEPoint;

  constructor(c: Circle, ctr: SEPoint, radius: number) {
    super();
    this.normalDir = new Vector3();
    this.normalDir.copy(c.centerPoint);
    this.center = ctr;
    this.radius = radius;
    this.ref = c;
    CIRCLE_COUNT++;
    this.name = `C-${CIRCLE_COUNT}`;
  }

  set normalDirection(v: Vector3) {
    this.normalDir.copy(v);
    this.ref.centerPoint = v;
  }

  get normalDirection(): Vector3 {
    return this.normalDir;
  }

  get centerPoint(): SEPoint {
    return this.center;
  }

  public isHitAt(spherePos: Vector3): boolean {
    const angleToCenter = spherePos.angleTo(this.normalDir);
    return (
      Math.abs(angleToCenter - this.radius) < SETTINGS.circle.hitIdealDistance
    );
  }

  public update(): void {
    // No implementation yet
  }

  accept(v: Visitor): void {
    v.actionOnCircle(this);
  }
}
