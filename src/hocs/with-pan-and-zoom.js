import React from 'react'

export default function withPanAndZoom(Child) {
  return class PanAndZoom extends React.Component {
    constructor(props) {
      super(props)
      this.graphRef = React.createRef()
      this.state = {
        translate: [0, 0],
        scale: props.scale || 1,
      }
    }

    scaleScreenToWorld = ([x, y], scale = this.state.scale) => {
      x = x / scale
      y = y / scale
      return [x, y]
    }

    mapScreenToWorld = ([x, y], scale = this.state.scale) => {
      x = (x - this.state.translate[0]) / scale
      y = (y - this.state.translate[1]) / scale
      return [x, y]
    }

    mapWorldToScreen = ([x, y], scale = this.state.scale) => {
      x = x * scale + this.state.translate[0]
      y = y * scale + this.state.translate[1]
      return [x, y]
    }

    handleMouseDown = evt => {
      if (evt.button !== 0) return
      this.setState({
        translating: {
          initialCursor: [evt.clientX, evt.clientY],
          initialWorld: this.state.translate,
        }
      })
    }

    handleMouseMove = event => {
      if (!this.state.translating) return
      const x = this.state.translating.initialWorld[0] + event.clientX - this.state.translating.initialCursor[0]
      const y = this.state.translating.initialWorld[1] + event.clientY - this.state.translating.initialCursor[1]
      this.setState({translate: [x, y]})
      // this.props.onMouseMove && this.props.onMouseMove(event)
    }

    handleMouseUp = event => {
      if (this.state.translating) this.setState({translating: null})
      this.props.onMouseUp && this.props.onMouseUp(event)
    }

    handleWheel = evt => {
      const scaleSensitivity = 0.002
      const newScale = this.state.scale * (1 - scaleSensitivity * evt.deltaY)
      const p = [
        evt.pageX - this.graphRef.current.offsetLeft,
        evt.pageY - this.graphRef.current.offsetTop,
      ]
      const pWorld = this.mapScreenToWorld(p)
      const pAfterScale = this.mapWorldToScreen(pWorld, newScale)

      const translateToKeepPointUnderCursorStatic = [
        this.state.translate[0] + (p[0] - pAfterScale[0]),
        this.state.translate[1] + (p[1] - pAfterScale[1]),
      ]
      this.setState({
        scale: newScale,
        translate: translateToKeepPointUnderCursorStatic,
      })
    }

    render() {
      const scale = this.state.scale
      const translate = this.state.translate
      return (
        <div
          className="pan-and-zoom-interact-container"
          ref={this.graphRef}
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onWheel={this.handleWheel}
        >
          <div
            className="pan-and-zoom-transform-container"
            style={{
              transform: `translate(${translate[0]}px,${translate[1]}px) scale(${scale})`,
              transformOrigin: '0px 0px',
            }}
          >
            <Child {...this.props} />
          </div>
        </div>
      )
    }
  }
}