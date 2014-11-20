/** @jsx React.DOM */
var ProductStore = {
    _state: {
        products: []
    },

    getState: function() {
        return this._state;
    },

    updateProducts: function(products) {
        this._state.products = products;
        this.onChange();
    },

    onChange: function() {
        // nothing
        return 'hi';
    }
};


var ProductActions = {
    updateProducts: function(products) {
        ProductStore.updateProducts(products);
    }
}


var Catalog = React.createClass({
    getStateFromStore: function() {
        return ProductStore.getState();
    },

    getInitialState: function() {
        return {
            products: [ ]
        }
    },

    componentDidMount: function() {
        //this.setState(this.getInitialState());
        ProductStore.onChange = this.onChange;
    },

    onChange: function() {
        this.setState(this.getStateFromStore());
    },

    render: function() {
        return (
            <div className="catalog">
                <h1> Catalog Page </h1>

                <SearchForm/>
                <SearchResults products={this.state.products}/>
            </div>
        );
    }
});

var SearchForm = React.createClass({
    handleSubmit: function(event) {
        event.preventDefault();
        var searchTerm = this.refs.term.getDOMNode();
        var url = 'http://localhost:3000/query/' + searchTerm.value;

        $.ajax({
            type: 'GET',
            url: url,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function(json) {
                var products = json._embedded['http://hautelook.com/rels/products'];
                console.log(json);
                ProductActions.updateProducts(products);
            },
            error: function(e) {
                console.log('failed');
                console.log(e);
            }
        });
    },

    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="searchTerm">Search for Products</label>
                <input id="searchTerm" type="input" ref="term"/>
                <button type="submit">Search</button>
            </form>
        );
    }
});


var SearchResults = React.createClass({
    prevPage: function() {
        console.log('prev');
    },

    nextPage: function() {
        console.log('next');
    },

    render: function() {
        var productList = this.props.products.map(function(product) {
            return <li className="product-container"><Product data={product}/></li>
        });

        return (
            <ul className="search-results">
                {productList}
            </ul>

        )
    }
});

var Product = React.createClass({

    getImageUrl: function() {
        function doReplace(str, replacements) {
            var newStr = str;

            for (var key in replacements) {
                var reg = new RegExp("\\{" + key + "\\}", "gm");
                newStr = newStr.replace(reg, replacements[key]);
            }
            return newStr;
        }

        var replacements = {
            width: '250',
            height: '350',
            size: 'large'
        };

        var imageUrls = this.props.data._embedded['http://hautelook.com/rels/skus'][0]._links['http://hautelook.com/rels/images'];


        if (_.isArray(imageUrls)) {
            return doReplace( imageUrls[0].href, replacements);
        }

        return doReplace(imageUrls.href, replacements);

    },

    render: function() {
        return (
            <div className="product">
                <p><img src={this.getImageUrl()} /></p>
                <p>{this.props.data.name}</p>
            </div>
        );
    }
});

React.render(
    <Catalog />,
    document.body
);