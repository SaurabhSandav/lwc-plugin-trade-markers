import { Coordinate, ISeriesPrimitiveAxisView } from 'lightweight-charts';
import { Point, TradeMarkerDataSource } from './data-source';
import { TradeMarkersLabelOptions } from './options';

abstract class TradeMarkersAxisView implements ISeriesPrimitiveAxisView {

	_source: TradeMarkerDataSource;
	_p: Point;
	_labelOptions: TradeMarkersLabelOptions;
	_pos: Coordinate | null = null;

	constructor(
		source: TradeMarkerDataSource,
		p: Point,
		labelOptions: TradeMarkersLabelOptions,
	) {
		this._source = source;
		this._p = p;
		this._labelOptions = labelOptions;
	}
	abstract update(): void;
	abstract text(): string;

	coordinate() {
		return this._pos ?? -1;
	}

	visible(): boolean {
		return this._source.options.showLabels;
	}

	tickVisible(): boolean {
		return this._source.options.showLabels;
	}

	textColor() {
		return this._labelOptions.labelTextColor;
	}

	backColor() {
		return this._labelOptions.labelColor;
	}

	movePoint(p: Point) {
		this._p = p;
		this.update();
	}
}

export class TradeMarkersPriceAxisView extends TradeMarkersAxisView {

	update() {
		const series = this._source.series;
		this._pos = series.priceToCoordinate(this._p.price);
	}

	text() {
		return this._source.options.priceLabelFormatter(this._p.price);
	}
}
