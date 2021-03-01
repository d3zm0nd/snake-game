 const background = (props) => {
    const getCells = (props) => {
        let content = [];
        for (let i = 0; i < props.sizeArea; i++) {
            for (let j = 0; j < props.sizeArea; j++) {
                let classNames = ['game-background-cell'];
                const style = {
                    left: `${i * props.sizeCell}px`,
                    top: `${j * props.sizeCell}px`,
                    width: `${props.sizeCell}px`,
                    height: `${props.sizeCell}px`
                };
                if ((i + (j % 2)) % 2) {
                    classNames.push('game-background-cell--dark');
                } else {
                    classNames.push('game-background-cell--light');
                }
                content.push(<div className={classNames.join(' ')} style={style} key={`${i}_${j}`}></div>);
            }
        }
        return content;
    };

    return <div className="game-background">{getCells(props)}</div>
}

export default background;