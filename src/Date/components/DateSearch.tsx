import { Component, createElement } from "react";
import "react-datetime/css/react-datetime.css";
import "../ui/DateSearch.scss";

export interface DateSearchProps {
    onDateChange: (query: Date|null) => void;
}

interface DateSearchState {
    query: Date|null;
}

export class DateSearch extends Component<DateSearchProps, DateSearchState> {
    private searchTimeOut = 500;
    private updateHandle?: number;
    private resetQueryHandle = this.resetQuery.bind(this);
    private onChangeHandle = this.onChange.bind(this);

    readonly state: DateSearchState = { query: null };

    render() {
        // return <div className="search-bar">
        //             <DateTime 
        //                 onChange={this.onChangeHandle}
        //                 value={this.state.query}
        //             />
        //             {this.renderReset}
        //         </div>

        return createElement("div",
            {
                className: "search-bar"
            },
            createElement("DateTime", {
                onChange: this.onChangeHandle,
                value: this.state.query
            }),
            this.renderReset()
        );
    }

    // componentWillReceiveProps(newProps: DateSearchProps) {
    //     // if (this.state.query !== newProps.defaultQuery) {
    //     //     this.setState({ query: newProps.defaultQuery });
    //     // }
    // }


    private onChange(date: Date) {

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

    private renderReset() {
        if (this.state.query) {
            return createElement("button",
                {
                    className: `btn-transparent visible`,
                    onClick: this.resetQueryHandle
                },
                createElement("span", { className: "glyphicon glyphicon-remove" })
            );
        }

        return null;
    }

    private resetQuery() {
        const query = null;

        this.setState({ query });
        this.props.onDateChange(query);
    }
}
