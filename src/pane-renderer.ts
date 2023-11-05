import { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from 'fancy-canvas';
import { ISeriesPrimitivePaneRenderer } from 'lightweight-charts';
import { TradeCoordinates } from './pane-view';
import { positionsBox } from './helpers/dimensions/positions';

export class TradeMarkersPaneRenderer implements ISeriesPrimitivePaneRenderer {

	_tradeCoordinates: Array<TradeCoordinates | null> = [];
	_stopFillColor: string;
	_targetFillColor: string;
	_exitArrowColor: string;
	_separatorColor: string;

	constructor(
		tradeCoordinates: Array<TradeCoordinates | null> = [],
		stopFillColor: string,
		targetFillColor: string,
		exitArrowColor: string,
		separatorColor: string,
	) {
		this._tradeCoordinates = tradeCoordinates;
		this._stopFillColor = stopFillColor;
		this._targetFillColor = targetFillColor;
		this._exitArrowColor = exitArrowColor;
		this._separatorColor = separatorColor;
	}

	draw(target: CanvasRenderingTarget2D) {
		target.useBitmapCoordinateSpace(scope => {

			this._tradeCoordinates.forEach((tradeCoordinates) => {

				if (tradeCoordinates != null) {
					this.drawDiagram(scope, tradeCoordinates);
				}
			});
		});
	}

	drawDiagram(scope: BitmapCoordinatesRenderingScope, tradeCoordinates: TradeCoordinates) {

		const ctx = scope.context;
		const horizontalPositions = positionsBox(
			tradeCoordinates.entryX,
			tradeCoordinates.exitX,
			scope.horizontalPixelRatio
		);

		// Stop Rect

		ctx.save()

		const stopVerticalPositions = positionsBox(
			tradeCoordinates.entryY,
			tradeCoordinates.stopY,
			scope.verticalPixelRatio
		);

		ctx.fillStyle = this._stopFillColor;

		ctx.fillRect(
			horizontalPositions.position,
			stopVerticalPositions.position,
			horizontalPositions.length,
			stopVerticalPositions.length
		);

		ctx.restore()

		// Target Rect

		ctx.save()

		const targetVerticalPositions = positionsBox(
			tradeCoordinates.entryY,
			tradeCoordinates.targetY,
			scope.verticalPixelRatio
		);

		ctx.fillStyle = this._targetFillColor;

		ctx.fillRect(
			horizontalPositions.position,
			targetVerticalPositions.position,
			horizontalPositions.length,
			targetVerticalPositions.length
		);

		ctx.restore()

		// Exit Arrow
		this.drawArrow(ctx, tradeCoordinates.entryX, tradeCoordinates.entryY, tradeCoordinates.exitX, tradeCoordinates.exitY);

		// Separator
		this.drawSeparator(ctx, tradeCoordinates.entryX, tradeCoordinates.exitX, tradeCoordinates.entryY)
	}

	drawSeparator(ctx: CanvasRenderingContext2D, startX: number, endX: number, y: number) {

		ctx.save()

		ctx.strokeStyle = this._separatorColor;
        ctx.lineWidth = 0.2;

		ctx.beginPath();
		ctx.moveTo(startX, y);
		ctx.lineTo(endX, y);
		ctx.stroke();

		ctx.restore()
	}

	drawArrow(ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {

		var headlen = 10; // length of head in pixels
		var dx = tox - fromx;
		var dy = toy - fromy;
		var angle = Math.atan2(dy, dx);

		ctx.save();

		ctx.strokeStyle = this._exitArrowColor;

		ctx.beginPath();
		ctx.setLineDash([5]);
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();

		ctx.beginPath();
		ctx.setLineDash([0]);
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
		ctx.stroke();

		ctx.restore();
	}
}
