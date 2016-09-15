import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

export default (query, component, options = {}) => {
    (new SimpleSchema({
        reactive: {type: Boolean, defaultValue: false},
        dataProp: {type: String, defaultValue: 'data'}
    })).clean(options);

    if (options.reactive) {
        return createContainer((props) => {
            if (props.params) {
                query.setParams(props.params);
            }

            const handler = query.subscribe();

            return {
                query,
                loading: !handler.ready(),
                [options.dataProp]: query.fetch(),
                ...props
            }
        }, component);
    }

    class MethodQueryComponent extends React.Component {
        constructor() {
            super();
            this.state = {
                [options.dataProp]: undefined,
                error: undefined,
                loading: true
            }
        }

        componentWillReceiveProps(nextProps) {
            this._fetch(nextProps.params);
        }

        componentWillMount() {
            this._fetch(this.props.params);
        }

        _fetch(params) {
            if (params) {
                query.setParams(params);
            }

            query.fetch((error, data) => {
                this.setState({
                    error,
                    [options.dataProp]: data,
                    loading: false
                })
            });
        }

        render() {
            const {state, props} = this;

            return React.createElement(component, {
                query,
                ...state,
                ...props
            })
        }
    }

    MethodQueryComponent.propTypes = {
        params: React.PropTypes.object
    };

    return MethodQueryComponent;
}