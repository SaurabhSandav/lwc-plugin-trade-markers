

export interface TradeMarkersLabelOptions {
	labelColor: string;
	labelTextColor: string;
}

export interface TradeMarkersOptions {
	//* Define the options for the primitive.
	entryLabelOptions: TradeMarkersLabelOptions;
	stopFillColor: string;
	stopLabelOptions: TradeMarkersLabelOptions;
	targetFillColor: string;
	targetLabelOptions: TradeMarkersLabelOptions;
	exitArrowColor: string;
	separatorColor: string;
	showLabels: boolean;
	priceLabelFormatter: (price: number) => string;
}

export const defaultOptions: TradeMarkersOptions = {
	//* Define the default values for all the primitive options.
	entryLabelOptions: {
		labelColor: '#787b86',
		labelTextColor: 'white',
	},
	stopFillColor: 'rgba(244, 67, 54, 0.2)',
	stopLabelOptions: {
		labelColor: '#f44336',
		labelTextColor: 'white',
	},
	targetFillColor: 'rgba(0, 150, 136, 0.2)',
	targetLabelOptions: {
		labelColor: '#009688',
		labelTextColor: 'white',
	},
	exitArrowColor: '#808c94',
	separatorColor: 'black',
	showLabels: true,
	priceLabelFormatter: (price: number) => price.toFixed(2),
} as const;
