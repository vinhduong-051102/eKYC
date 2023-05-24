import React from "react";
import reactCSS from "reactcss";
import { SketchPicker, ColorResult } from "react-color";

interface IProps {
    color: string;
    onChangeComplete: (color: string) => void;
}

class ColorSketchPicker extends React.Component<IProps, any> {
    state = {
        displayColorPicker: false,
        // color: {
        //   r: '241',
        //   g: '112',
        //   b: '19',
        //   a: '1',
        // },
        color: this.props.color || "#000"
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color: ColorResult) => {
        this.setState({ color: color.hex });
    };

    render() {
        const styles = reactCSS({
            default: {
                container: {
                    height: "28px"
                },
                color: {
                    height: "18px",
                    borderRadius: "2px",
                    // background: `rgba(${this.state.color.r}, ${this.state.color.g}, ${this.state.color.b}, ${this.state.color.a})`,
                    background: `${this.state.color}`
                },
                swatch: {
                    padding: "5px",
                    background: "#fff",
                    borderRadius: "1px",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.15)",
                    cursor: "pointer",
                    transform: "translate(2px, 2px)",
                    height: 18,
                    float: "right",
                    width: "200px",
                },
                popover: {
                    position: "absolute",
                    zIndex: "2"
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px"
                }
            }
        });

        return (
            <div style={styles.container}>
                <div className="color-picker-swatch" style={styles.swatch} onClick={this.handleClick}>
                    <div className="color-picker-color" style={styles.color} />
                </div>
                {this.state.displayColorPicker ? (
                    <div style={styles.popover}>
                        <div style={styles.cover} onClick={this.handleClose} />
                        <SketchPicker
                            color={this.state.color}
                            onChange={this.handleChange}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ColorSketchPicker;
