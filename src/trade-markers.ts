import { AutoscaleInfo, Logical, Time, DataChangedScope } from 'lightweight-charts';
import {
	TradeMarkersPriceAxisPaneView,
	TradeMarkersTimeAxisPaneView,
} from './axis-pane-view';
import { TradeMarkersPriceAxisView, TradeMarkersTimeAxisView } from './axis-view';
import { Point, TradeMarkersDataSource } from './data-source';
import { TradeMarkersOptions, defaultOptions } from './options';
import { TradeMarkersPaneView } from './pane-view';
import { PluginBase } from './plugin-base';

export class TradeMarkers
	extends PluginBase
	implements TradeMarkersDataSource
{
	_options: TradeMarkersOptions;
	_p1: Point;
	_p2: Point;
	_paneViews: TradeMarkersPaneView[];
	_timeAxisViews: TradeMarkersTimeAxisView[];
	_priceAxisViews: TradeMarkersPriceAxisView[];
	_priceAxisPaneViews: TradeMarkersPriceAxisPaneView[];
	_timeAxisPaneViews: TradeMarkersTimeAxisPaneView[];

	constructor(
		p1: Point,
		p2: Point,
		options: Partial<TradeMarkersOptions> = {}
	) {
		super();
		this._p1 = p1;
		this._p2 = p2;
		this._options = {
			...defaultOptions,
			...options,
		};
		this._paneViews = [new TradeMarkersPaneView(this)];
		this._timeAxisViews = [
			new TradeMarkersTimeAxisView(this, p1),
			new TradeMarkersTimeAxisView(this, p2),
		];
		this._priceAxisViews = [
			new TradeMarkersPriceAxisView(this, p1),
			new TradeMarkersPriceAxisView(this, p2),
		];
		this._priceAxisPaneViews = [new TradeMarkersPriceAxisPaneView(this, true)];
		this._timeAxisPaneViews = [new TradeMarkersTimeAxisPaneView(this, false)];
	}

	updateAllViews() {
		this._paneViews.forEach(pw => pw.update());
		this._timeAxisViews.forEach(pw => pw.update());
		this._priceAxisViews.forEach(pw => pw.update());
		this._priceAxisPaneViews.forEach(pw => pw.update());
		this._timeAxisPaneViews.forEach(pw => pw.update());
	}

	priceAxisViews() {
		return this._priceAxisViews;
	}

	timeAxisViews() {
		return this._timeAxisViews;
	}

	paneViews() {
		return this._paneViews;
	}

	priceAxisPaneViews() {
		return this._priceAxisPaneViews;
	}

	timeAxisPaneViews() {
		return this._timeAxisPaneViews;
	}

	autoscaleInfo(
		startTimePoint: Logical,
		endTimePoint: Logical
	): AutoscaleInfo | null {
		if (
			this._timeCurrentlyVisible(this.p1.time, startTimePoint, endTimePoint) ||
			this._timeCurrentlyVisible(this.p2.time, startTimePoint, endTimePoint)
		) {
			return {
				priceRange: {
					minValue: Math.min(this.p1.price, this.p2.price),
					maxValue: Math.max(this.p1.price, this.p2.price),
				},
			};
		}
		return null;
	}

	dataUpdated(scope: DataChangedScope): void {
	}

	_timeCurrentlyVisible(
		time: Time,
		startTimePoint: Logical,
		endTimePoint: Logical
	): boolean {
		const ts = this.chart.timeScale();
		const coordinate = ts.timeToCoordinate(time);
		if (coordinate === null) return false;
		const logical = ts.coordinateToLogical(coordinate);
		if (logical === null) return false;
		return logical <= endTimePoint && logical >= startTimePoint;
	}

	public get options(): TradeMarkersOptions {
		return this._options;
	}

	applyOptions(options: Partial<TradeMarkersOptions>) {
		this._options = { ...this._options, ...options };
		this.requestUpdate();
	}

	public get p1(): Point {
		return this._p1;
	}

	public get p2(): Point {
		return this._p2;
	}
}
