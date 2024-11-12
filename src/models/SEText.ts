import { ObjectState } from "@/types";
import i18n from "@/i18n";
import { SENodule } from "./SENodule";
import { Vector3 } from "three";
import SETTINGS from "@/global-settings";
import { Visitor } from "@/visitors/Visitor";
import TextTool from "@/plottables/Text";
const { t } = i18n.global;

export class SEText extends SENodule {
	public declare ref: TextTool //<- plottable Text

	private x: number;// x, y coordinates
	private y: number;
	private text: string;// string text
	protected _locationVector = new Vector3();

	constructor(txt:string, x:number, y:number) {
		super();
		this.text = txt;
		this.x = x;
		this.y = -y;
    console.log(`SEText.x = ${this.x}, SEText.y = ${this.y}`);
    const text = new TextTool(this.text, this.x, this.y, this.name);
    this.ref = text;
	}

	public shallowUpdate(): void {
		this.ref.positionVector = this._locationVector;
    	if (this.showing) {
      		this.ref.setVisible(true);
    	} else {
      		this.ref.setVisible(false);
    	}
	}

	public update(
    objectState?: Map<number, ObjectState>,
    orderedSENoduleList?: number[]
    ): void {

    	this.setOutOfDate(false);
    	this.shallowUpdate();

    	if (objectState && orderedSENoduleList) {
      		if (objectState.has(this.id)) {
        		console.log(
          `		Text with id ${this.id} has been visited twice proceed no further down this branch of the DAG.`
        	);
        	return;
      	}
      	orderedSENoduleList.push(this.id);
      	const location = new Vector3();
      	location.copy(this._locationVector);
      	objectState.set(this.id, {
        	kind: "text",
        	object: this,
        	locationVector: location
      	});
		}
	}

  // implement for MOVE tool
  // Coordinates: how to pass? Normalize screen coords -> unit vector
	public isHitAt(unitIdealVector: Vector3, currentMagnificationFactor: number): boolean {

    // Get the bounding box of the text
    const boundingBox = this.ref.boundingRectangle;
    // Get the canvas size so the bounding box can be corrected
    const canvasWidth = SENodule.store.canvasWidth;
    const canvasHeight = SENodule.store.canvasHeight;
    const zoomTranslation = SENodule.store.zoomTranslation;

    return (
      boundingBox.left - canvasWidth / 2 <
        unitIdealVector.x *
          SETTINGS.boundaryCircle.radius *
          currentMagnificationFactor +
          zoomTranslation[0] &&
      unitIdealVector.x *
        SETTINGS.boundaryCircle.radius *
        currentMagnificationFactor +
        zoomTranslation[0] <
        boundingBox.right - canvasWidth / 2 &&
      boundingBox.top - canvasHeight / 2 <
        -unitIdealVector.y *
          SETTINGS.boundaryCircle.radius *
          currentMagnificationFactor +
          zoomTranslation[1] && // minus sign because text layers are not y flipped
      -unitIdealVector.y *
        SETTINGS.boundaryCircle.radius *
        currentMagnificationFactor +
        zoomTranslation[1] < // minus sign because text layers are not y flipped
        boundingBox.bottom - canvasHeight / 2
    );
	}
	public customStyles(): Set<string> {
		/**None**/
    return new Set();
	}
	public accept(v: Visitor): boolean {
		/**None**/
    return false;
	}
	public get noduleItemText(): string {
		/**None**/
    return "";
	}
	public get noduleDescription(): string {
		/**None**/
    return "";
	}

}
