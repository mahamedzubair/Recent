import React, { Component, Fragment } from "react";
import { translate } from "react-i18next";

import UICheckSelection from "UI/UICheckSelection";
import UIAccordion from "UI/UIAccordion";
import FilterList from "components/FilterList";
import * as FilterConstants from "constants/claims";
import { connect } from 'react-redux';
import * as Actions from '../actions';


@translate(['common', 'table'])
class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: this.props.filteredData,
      filters: {},
      //newfilter: [],
      headers: this.props.filteredDataHeaders,
      isFilters: false,
      filteredData: [... this.props.filteredData]
    };
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchFilters());
  }

  filterListInit = (type = 'init') => {
    let filters = { ... this.state.filters };
    for(let key in this.props.data.filterData[0]) {
      if (!filters[key] || type === 'clear') {
        filters[key] = [];
      }
    }
    return filters;
  }
  
  clearSelection = () => {
    this.setState({ filters: this.filterListInit(FilterConstants.PROP_CLEAR) }, 
    () => {
      this.onFilterChange();
    });
  }

  changeFilter = (name, value, key) => {
    let filters = this.state.filters;
    if (!filters[key]) {
      filters[key] = [];
    }
    if (filters[key].indexOf(value[value.length - 1]) === -1 && value.length ) {
      filters[key].push(value[value.length - 1])
    }
    filters[key].forEach((list, index) => {
      if (value.indexOf(list) === -1) {
        filters[key].splice(index, 1)
      }
    });
    this.setState({ filters: filters });
  };

  onFilterChange = () => {
    let filters = { ... this.state.filters }
    // for (let key in filters) {
    //   if (!filters[key].length) {
    //     delete filters[key];
    //   }
    // }
    // let filteredData = [... this.props.filteredData];
    // if (this.state.filters) {
    //   filteredData = filteredData.filter((list) => {
    //     return Object.keys(filters).every((key) => {
    //       return filters[key].some((value) => {
    //         return !list[key].length || list[key] === value;
    //       });
    //     });
    //   });
    //   this.setState({ filteredData: filteredData });
    //   this.props.filterChange(filteredData);
    if (filters) {
      this.props.filterChange(filters);
    }
  };

  toggleFilters = () => {
    this.setState({ isFilters: !this.state.isFilters });
  };

  listContent = (data, selectionFilter) => {
    return (
        <FilterList
        dataList={data} 
        selectionFilter={selectionFilter} 
        filterMaxList={this.props.filterMaxList}
        changeFilter={this.changeFilter}
        />
    )
  }

  renderFilters = (t) => {
    let filters = this.filterListInit();
    let selectionFilter = [];
    for (let key in filters) {
      filters[key].forEach((list, i) => {
        if (selectionFilter.indexOf(list) === -1) {
          selectionFilter.push(list)
        }
      });
    }
    let filterData = [];
    // let filterLimitedIndex = this.props.filterLimitedIndex && this.props.filteredDataHeaders.length >= this.props.filterLimitedIndex ? this.props.filterLimitedIndex : this.props.filteredDataHeaders.length;
    // for (let i = 0; i < filterLimitedIndex; i++) {
    //   filterData.push({
    //     'label': `${this.props.filteredDataHeaders[i].label}`, 'header': `${this.props.filteredDataHeaders[i].label}`, 'id': `${this.props.filteredDataHeaders[i].key}`,
    //     'data': [...new Set(this.props.filteredData.map((item, index) => {
    //       return { value: item[this.props.filteredDataHeaders[i].key], label: item[this.props.filteredDataHeaders[i].key], key: this.props.filteredDataHeaders[i].key }
    //     }))]
    for(let key in this.props.data.filterData[0]) {
      filterData.push({
         'label': `${key}`, 'header': `${key}`, 'id': `${key}`,
         'data': this.props.data.filterData[0][key].map((item, index) => {
           return { value: item, label: item, key: key }
         })
      })
      // filterData[i]['data'] = filterData[i]['data'].reduce((r, i) =>
      //   !r.some(j => i.label === j.label) ? [...r, i] : r
      //   , []);
      //   filterData[i]['body'] = this.listContent(filterData[i], selectionFilter)
    }
    filterData.forEach((list, i) => {
      list['body'] = this.listContent(list, selectionFilter)
    });
    return (
      <div className={this.state.isFilters ? 'active filter-list-content' : 'in-active filter-list-content'}>
        {this.state.isFilters &&
          <div id="sidenav">
            <div id="closebtn">
              <button className="linklike" onClick={this.clearSelection}>
                {t('table:filter.clear')}
              </button>
              <span aria-hidden="true" aria-expanded={this.state.isFilters}
                onClick={this.toggleFilters} className="icon icon-1x icon-remove padding-left-1x">
              </span>
            </div>
            <h1 className="padding-left-1x">{t('table:filter.filter')}</h1>
            <div className="sidenav-content">
            <UIAccordion className="accordion-filter"
              openNextPanel={true} allowManyPanelsToBeOpen={true} icon={false}  openAllNPanels={4}>
              {filterData}
            </UIAccordion>
            </div>
            <div className="row collapse fixed-button">
              <div className="columns small-12 ">
                <button onClick={() => {this.onFilterChange(); this.toggleFilters()}} className="button expand primary" >
                  {t('table:filter.applyfilter')}
                </button>
              </div>
              <div className="columns small-12">
                <button aria-expanded={this.state.isFilters} className="button expand secondary" onClick={this.toggleFilters} >
                  {t('table:filter.close')}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  render() {
    const { t } = this.props;
    return (
      <Fragment>
        <button
          className="button primary filter-btn"
          onClick={this.toggleFilters}
          aria-controls={this.props.filterAriaControl}
          aria-expanded={this.state.isFilters}
          aria-haspopup="listbox"
        >
          <span aria-hidden="true" className="icon icon-filter" />
          <span>{t('table:filter.filter')}</span>
        </button>
        {this.renderFilters(t)}
      </Fragment>

    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.FilterReducer
  };
}

export default connect(mapStateToProps)(Filters);