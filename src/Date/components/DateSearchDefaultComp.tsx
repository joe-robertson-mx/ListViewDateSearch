import React from "react";
import * as moment from 'moment'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export interface DateSearchProps {
    onDateChange: (query: string|Date|moment.Moment|undefined) => void;
    dateFormat: string;
}

interface DateSearchState {
    query: string|Date|moment.Moment|undefined;
}
 
export class MyDTPicker extends React.Component<DateSearchProps, DateSearchState> {
    private searchTimeOut = 500;
    private updateHandle?: number;
    private onChangeHandle = this.onChange.bind(this);
    readonly state: DateSearchState = { query: undefined };

    public onChange(date: string|Date|moment.Moment|undefined) {
        if (this.state.query !== date) {
            if (this.updateHandle) {
                window.clearTimeout(this.updateHandle);
            }
            this.updateHandle = window.setTimeout(() => {
                this.props.onDateChange(date);
            }, this.searchTimeOut);
        }
        this.setState({ query:date });
    }
    
    render() {
        return <Datetime
                onChange={this.onChangeHandle}
                value={this.state.query}
                timeFormat={false}
                dateFormat={this.props.dateFormat}
                />;
    }
}

