import { Component, ReactNode, createElement } from "react";
import classNames from "classnames";

import { Alert } from "./Shared/components/Alert";
import { DataSourceHelper } from "./Shared/DataSourceHelper/DataSourceHelper";
import { GroupedOfflineConstraint, SharedUtils, WrapperProps } from "./Shared/SharedUtils";

import { MyDTPicker as DateSearch} from "./Date/components/DateSearchDefaultComp";
import { Validate } from "./Validate";
import { SharedContainerUtils } from "./Shared/SharedContainerUtils";
import * as moment from 'moment'
// import { FormViewState } from "./Shared/FormViewState";


export interface ContainerProps extends WrapperProps {
    attribute: SearchAttributes;
    entity: string;
    dateFormat: string;
}

export interface SearchAttributes {
    attribute: string;
}

export interface ContainerState {
    alertMessage?: ReactNode;
    listViewAvailable: boolean;
    searchDate: string|Date|moment.Moment|undefined;
}


export default class SearchContainer extends Component<ContainerProps, ContainerState> {
    private dataSourceHelper?: DataSourceHelper;
    private widgetDom: Element | null = null;
    private retriesFind = 0;

    constructor(props: ContainerProps) {
        super(props);

        this.applySearch = this.applySearch.bind(this);;

        this.state = {
            alertMessage: Validate.validateProps(),
            searchDate: new Date,
            listViewAvailable: false
        };

    }

    render() {
        return createElement("div", {
                className: classNames("widget-text-box-search", this.props.class),
                ref: widgetDom => this.widgetDom = widgetDom,
                style: SharedUtils.parseStyle(this.props.style)
            },
            createElement(Alert, {
                className: "widget-text-box-search-alert"
            }, this.state.alertMessage),
            this.renderDateSearch()
        );
    }

    componentDidMount() {
        SharedUtils.delay(this.connectToListView.bind(this), this.checkListViewAvailable.bind(this), 20);
    }

    componentDidUpdate(_prevProps: ContainerProps, prevState: ContainerState) {
        if (this.state.listViewAvailable && !prevState.listViewAvailable) {
            this.applySearch(this.state.searchDate);
        }
    }

    private checkListViewAvailable(): boolean {
        if (!this.widgetDom) {
            return false;
        }
        this.retriesFind++;
        if (this.retriesFind > 25) {
            return true; // Give-up searching
        }
        return !!SharedContainerUtils.findTargetListView(this.widgetDom.parentElement, this.props.entity);
    }

    private renderDateSearch(): ReactNode {
        if (!this.state.alertMessage) {
            return createElement(DateSearch, {
                onDateChange: this.applySearch,
                dateFormat: this.props.dateFormat
            });
        }

        return null;
    }

    private applySearch(searchQuery: string|Date|moment.Moment|undefined) {
        const constraint = this.getDateConstraint(searchQuery);
        console.log (this.props.dateFormat)
        if (this.dataSourceHelper) {
            this.dataSourceHelper.setConstraint(this.props.friendlyId, constraint);
        }
        this.setState({ searchDate: searchQuery });
    }

    private getDateConstraint(searchQuery: string|Date|moment.Moment|undefined): string | GroupedOfflineConstraint {

        if (moment.isMoment(searchQuery)) {
            const day = searchQuery.date()
            const month = searchQuery.month() + 1 //Month starts at 0 in moment and 1 in Mendix
            const year = searchQuery.year()

            const constraints: string[] = [];
            constraints.push(`day-from-dateTime(${this.props.attribute}) = ${day}`)
            constraints.push(`month-from-dateTime(${this.props.attribute}) = ${month}`)
            constraints.push(`year-from-dateTime(${this.props.attribute}) = ${year}`)
            return "[" + constraints.join(" and ") + "]";
        }

        else return ""
    }

    private connectToListView() {
        let alertMessage = "";

        try {
            this.dataSourceHelper = DataSourceHelper.getInstance(this.widgetDom, this.props.entity);
        } catch (error) {
            alertMessage = error.message;
        }

        this.setState({
            alertMessage: alertMessage || Validate.validateProps(),
            listViewAvailable: !alertMessage
        });
    }

    // private getDefaultValue(): string {
    //     return this.viewStateManager.getPageState("defaultSearchText", this.props.defaultQuery);
    // }

}
