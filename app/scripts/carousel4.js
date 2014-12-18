//ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var IMAGES = [
    '/testImages/image1.jpg',
    '/testImages/image2.jpg',
    '/testImages/image3.jpg',
    '/testImages/image4.jpg',
    '/testImages/image5.jpg',
    '/testImages/image6.jpg'
];


var CarouselStore = {
    _state: {
        index: 0,
        maxSlides: 0
    },

    getState: function() {
        return this._state;
    },

    setActiveIndex: function(index) {
        this._state.index = index;
        this.onChange();
    },

    setMaxSlides: function(max) {
        this._state.maxSlides = max;
        this.onChange();
    },

    onChange: function() {
        return;
    }
}


var CarouselActions = {
    setActiveIndex: function(index) {
        var max = CarouselStore.getState().maxSlides;
        if (index > -1 && index < max) {
            CarouselStore.setActiveIndex(index);
        }
    },

    nextSlide: function() {
        var state = CarouselStore.getState();
        var newIndex = state.index + 1;
        var max = state.maxSlides;

        if (newIndex < max) {
            CarouselStore.setActiveIndex(newIndex)
        }
    },

    prevSlide: function() {
        var state = CarouselStore.getState();
        var newIndex = state.index - 1;

        if (newIndex > -1) {
            CarouselStore.setActiveIndex(newIndex)
        }
    },

    setMaxSlides: function(index) {
        CarouselStore.setMaxSlides(index);
    }
};

var Carousel = React.createClass({
    getInitialState: function() {
        return {
            index: 0,
            maxSlides: 0
        }
    },

    getStateFromStore: function() {
        return CarouselStore.getState();
    },

    componentDidMount: function() {
        var numSlides = this.props.items.length;
        CarouselActions.setMaxSlides(numSlides);
        CarouselStore.onChange = this.onChange;
    },


    onChange: function() {
        this.setState(this.getStateFromStore())
    },

    render: function() {
        var children = this.props.items.map(function(item) {
            return <CarouselItem data={item}/>;
        });

        return (
            <div className="carousel">
                <div style={{height: '350px', width: '233px'}} className="carousel__window">
                    <div className="carousel__slides" style={{left: -this.state.index * 233 + 'px', width: 233 * this.state.maxSlides + 'px'}}>
                        {children}
                    </div>
                </div>
                <CarouselControl/>
                <CarouselPages numSlides={this.props.items.length} selected={this.state.index}/>

            </div>
        );
    }
});


var CarouselItem = React.createClass({
    render: function() {
        return <img height='350' width='233' src={this.props.data}/>;
    }
});


var CarouselControl = React.createClass({
    render: function() {
        return (
            <div className='controls'>
                <a onClick={this.handlePrevious}>Previous </a>
                <a onClick={this.handleNext}>Next </a>
            </div>
        );
    },

    handlePrevious: function(e) {
        e.preventDefault();
        CarouselActions.prevSlide();
    },

    handleNext: function(e) {
        e.preventDefault();
        CarouselActions.nextSlide();
    }
});

var CarouselPages = React.createClass({
    render: function() {
        var num = this.props.numSlides;
        var children = [];
        for (var i = 0; i < num; i++) {
            var isSelected = (this.props.selected === i);
            console.log(isSelected);
            children.push(<CarouselPager key={i} index={i} selected={isSelected}/>)
        }

        console.log('----');
        return (<div>{children}</div>);
    }
});


var CarouselPager = React.createClass({
    handleClick: function() {
        CarouselActions.setActiveIndex(this.props.index);
    },

    render: function() {
        var selected = this.props.selected;
        return (<a className="carousel__page" style={{fontWeight: 600 * selected}} onClick={this.handleClick}>{this.props.index}</a>);
    }
})


React.render(<Carousel items={IMAGES} />, document.body);
