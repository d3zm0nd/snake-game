const statistics = (props) => {
    return (
        <div className="game-statistics">
            <div>Speed: {props.speed}</div>
            <div>Size: {props.size}</div>
        </div>);
}

export default statistics;

