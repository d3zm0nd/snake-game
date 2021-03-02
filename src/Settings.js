const settings = (props) => {
    const changeBorderCollisions = () => {
        props.onChange('borderCollisions', !props.settings.borderCollisions);
    }

    const changeSelfCollisions = () => {
        props.onChange('selfCollisions', !props.settings.selfCollisions);
    }

    const changeCountFood = (ev) => {
        props.onChange('countFood', parseInt(ev.target.value, 10));
    }

    const changeSizeArea = (ev) => {
        props.onChange('sizeArea', parseInt(ev.target.value, 10));
    }

    const changeSound= (ev) =>{
        props.onChange('sound', !props.settings.sound);
    }

    return (<div className="game-settings">
        {/*
        <div>
            <span>Border collisions&nbsp;</span>
            <input type="checkbox" checked={props.settings.borderCollisions} onChange={changeBorderCollisions} />
        </div>*/}
        <div>
            <span>Self collisions&nbsp;</span>
            <input type="checkbox" checked={props.settings.selfCollisions} onChange={changeSelfCollisions} />
        </div>
        <div>
            <span>Count food&nbsp;</span>
            <select value={props.settings.countFood} onChange={changeCountFood}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>
        <div>
            <span>Size game area&nbsp;</span>
            <select value={props.settings.sizeArea} onChange={changeSizeArea}>
                <option value="8">8x8</option>
                <option value="16">16x16</option>
                <option value="32">32x32</option>
            </select>
        </div>
        <div>
            <span>Sound&nbsp;</span>
            <input type="checkbox" checked={props.settings.sound} onChange={changeSound} />
        </div>
    </div>
    )
}

export default settings;