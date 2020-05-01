import {
  Vector3,
  EllipseCurve,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Matrix4,
  Quaternion,
  Camera,
  Scene
} from "three";
import CursorHandler from "./CursorHandler";
// import Arrow from "@/3d-objs/Arrow";
import Vertex from "@/3d-objs/Vertex";
import SETTINGS from "@/global-settings";

// This circle is on the XY-plane
const UNIT_CIRCLE = new EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);

export default class LineHandler extends CursorHandler {
  protected startPoint: Vector3;
  protected endPoint: Vector3;
  protected geodesicDirection: Vector3;
  // private sphereDirection: Vector3;
  // private currentSurfacePoint: Vector3;
  protected circleQuaternion: Quaternion;
  // private normalArrow: Arrow;
  protected isMouseDown: boolean;
  // private isOnSphere: boolean;
  protected isCircleAdded: boolean;
  protected geodesic: Line;
  protected startDot: Vertex;
  constructor({
    canvas,
    camera,
    scene
  }: {
    canvas: HTMLCanvasElement;
    camera: Camera;
    scene: Scene;
  }) {
    super({ canvas, camera, scene });
    this.startPoint = new Vector3();
    this.endPoint = new Vector3();
    this.geodesicDirection = new Vector3();
    // this.sphereDirection = new Vector3();
    this.startDot = new Vertex();
    this.circleQuaternion = new Quaternion();
    // this.normalArrow = new Arrow(1.5, 0xff6600);
    this.isMouseDown = false;
    this.isCircleAdded = false;
    this.geodesic = new Line(
      // Subdivide the circle into 60 points
      new BufferGeometry().setFromPoints(UNIT_CIRCLE.getPoints(60)),
      new LineBasicMaterial({ color: 0xff0000 })
    );
  }

  activate = () => {
    this.canvas.addEventListener("mousemove", this.mouseMoved);
    this.canvas.addEventListener("mousedown", this.mousePressed);
    this.canvas.addEventListener("mouseup", this.mouseReleased);
    this.rayCaster.layers.disableAll();
    this.rayCaster.layers.enable(SETTINGS.layers.sphere);
    this.rayCaster.layers.enable(SETTINGS.layers.vertex);
  };

  deactivate = () => {
    this.canvas.removeEventListener("mousemove", this.mouseMoved);
    this.canvas.removeEventListener("mousedown", this.mousePressed);
    this.canvas.removeEventListener("mouseup", this.mouseReleased);
  };

  tiltGeodesicPlane = () => {
    // Using the triad method to determine the rotation matrix
    // https://en.wikipedia.org/wiki/Triad_method
    const desiredZ = new Vector3()
      .crossVectors(this.startPoint, this.currentPoint)
      .normalize();
    const desiredX = new Vector3().copy(this.startPoint).normalize();
    const desiredY = new Vector3().crossVectors(desiredZ, desiredX);
    const desiredRot = new Matrix4().makeBasis(desiredX, desiredY, desiredZ);

    this.geodesic.rotation.set(0, 0, 0);

    this.circleQuaternion.setFromRotationMatrix(desiredRot);
    this.geodesic.applyQuaternion(this.circleQuaternion);
  };

  mouseMoved = (event: MouseEvent) => {
    // console.debug("LineHandler::mousemoved");

    this.mapCursorToSphere(event);
    if (this.isOnSphere) {
      if (this.isMouseDown && this.theSphere) {
        // console.debug("LineHandler::mousedragged");
        if (!this.isCircleAdded) {
          this.isCircleAdded = true;
          this.scene.add(this.geodesic);
          this.scene.add(this.startDot);
        }
        this.tiltGeodesicPlane();
      }
    } else if (this.isCircleAdded) {
      this.scene.remove(this.geodesic);
      this.scene.remove(this.startDot);
      this.isCircleAdded = false;
    }
  };

  mousePressed = (/*event: MouseEvent*/) => {
    this.isMouseDown = true;
    if (this.isOnSphere) {
      const selected = this.hitObject;
      // Record the first point of the geodesic circle
      if (selected instanceof Vertex) {
        // Click on existing vertex, its position is local w.r.t to the sphere
        this.startPoint.copy(selected.position);
        // Convert the coordinate with respect to the world coordinate frame
        this.theSphere?.localToWorld(this.startPoint);
      } else {
        // Click on an open area on the sphere, tthe hit position is measured
        // with respect to the world coordinate frame
        this.scene.add(this.startDot);
        this.startPoint.copy(this.currentPoint);
      }
      this.startDot.position.copy(this.currentPoint);
    }
  };

  mouseReleased = (/*event: MouseEvent*/) => {
    this.isMouseDown = false;
    if (this.isOnSphere) {
      // Record the second point of the geodesic circle
      this.scene.remove(this.geodesic);
      this.scene.remove(this.startDot);
      this.isCircleAdded = false;
      this.endPoint.copy(this.currentPoint);
    }
  };
}
