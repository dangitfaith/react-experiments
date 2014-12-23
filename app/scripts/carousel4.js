ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
React.initializeTouchEvents(true);
var IMAGES = [
    '/testImages/image1.jpg',
    '/testImages/image2.jpg',
    '/testImages/image3.jpg',
    '/testImages/image4.jpg',
    '/testImages/image5.jpg',
    '/testImages/image6.jpg'
];


var Carousel = React.createClass({
    getInitialState: function() {
        return {
            index: 0,
            numSlides: 0
        }
    },

    setActiveIndex: function(index) {
        var max = this.state.numSlides;
        if (index > -1 && index < max) {
            this.setState({index: index});
        }
    },

    next: function(e) {
        e.preventDefault();
        var nextIndex = this.state.index + 1;
        if (nextIndex < this.state.numSlides) {
            this.setActiveIndex(nextIndex);
        }
    },

    prev: function(e) {
        e.preventDefault();
        var prevIndex = this.state.index - 1;
        if (prevIndex > -1) {
            this.setActiveIndex(prevIndex);
        }
    },

    componentDidMount: function() {
        var numSlides = this.props.items.length;
        this.setState({numSlides: numSlides});
    },

    render: function() {
        var width = this.props.slideWidth;
        var height = this.props.slideHeight;
        var isVertical = this.props.isVertical;

        var children = this.props.items.map(function(item, index) {
            return <CarouselItem data={item} height={height} width={width}/>;
        });

        var containerStyle = {
            width: width + 'px'
        };

        var slideWindowStyle = {
            height: height + 'px',
            width: width + 'px'
        };

        var transformValue = isVertical ? -this.state.index * height + 'px' : -this.state.index * width + 'px';
        var transformCSS = (isVertical ? 'translateY' : 'translateX') + '(' + transformValue + ')';
        var slideListStyle = {
            transform: transformCSS,
            height: isVertical ? this.state.numSlides * height + 'px' : height,
            width: isVertical ? width : this.state.numSlides * width + 'px'
        };

        return (
            <div id={this.props.id} className="carousel" style={containerStyle}>
                <div className="carousel__window" style={slideWindowStyle}>
                    <div className="carousel__slides" style={slideListStyle}>
                        {children}
                    </div>
                </div>
                <CarouselControl nextFunc={this.next} prevFunc={this.prev}/>
                <CarouselPages setIndex={this.setActiveIndex} selectedIndex={this.state.index} data={this.props.items}/>
            </div>
        );
    }
});


var CarouselItem = React.createClass({
    render: function() {
        return <img className="carousel__slide" height={this.props.height} width={this.props.width} src={this.props.data}/>;
    }
});


var CarouselControl = React.createClass({
    render: function() {
        return (
            <div className='carousel__controls'>
                <a className='carousel__control carousel__control--prev' onClick={this.handlePrevious}>Previous</a>
                <a className='carousel__control carousel__control--next' onClick={this.handleNext}>Next</a>
            </div>
        );
    },

    handlePrevious: function(e) {
        this.props.prevFunc(e);
    },

    handleNext: function(e) {
        this.props.nextFunc(e)
    }
});


var CarouselPages = React.createClass({
    componentDidMount: function() {

    },

    updateIndex: function(index) {
        this.props.setIndex(index);
    },

    render: function() {
        var children = this.props.data.map(function(item, index) {
            var isSelected = this.props.selectedIndex === index;
            return (<CarouselPager key={index} isSelected={isSelected} index={index} updateIndex={this.updateIndex}/>);
        }.bind(this));

        return (<div className='carousel__pages'>
            {children}
        </div>);
    }
});


var CarouselPager = React.createClass({
    handleClick: function() {
        this.props.updateIndex(this.props.index);
    },

    render: function() {
        var classString = 'carousel__page';

        if (this.props.isSelected) {
            classString += ' carousel__page--selected';
        }

        return (<a className={classString} onClick={this.handleClick}>{this.props.index + 1}</a>);
    }
});

React.render(<Carousel slideHeight="350" slideWidth="233" items={IMAGES}/>, document.getElementById('normal'));
React.render(<Carousel slideHeight="350" slideWidth="233" isVertical items={IMAGES}/>, document.getElementById('vertical'));
