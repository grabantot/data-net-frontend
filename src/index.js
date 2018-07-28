import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import GraphApi from './api/graph.api'
import Graph from './components/graph'
import withPanAndZoom from './hocs/with-pan-and-zoom'

const helpText = `
LMB double click - create node
LMB on node and drag - move node

RMB on node and drag - create edge (connection) to another node

mouse wheel - zoom
LMB on empty space and drag - pan

Ctrl + S - save graph

To open a graph enter its name to the location bar after '/', e.g. 'http://localhost:3000/js' will open a graph named 'js'.
If the graph with this name doesn't exist then it will be created on save.
`

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      backgroundText: helpText
    }
  }


  componentDidMount() {
    this.setState({backgroundText: helpText + '\n\nOpening graph'})
    GraphApi.getGraph()
      .then(graph => {
        window.g = graph
        this.setState({
          graph,
          backgroundText: helpText + '\n\nOpened'
        })
      })
      .catch(err => {
        this.setState({
          backgroundText: helpText + '\n\nError while opening\n' + err
        })
      })
  }

  render() {

    return (
      <div>
        <Comp/>
        <span>
          slfjsldj
        </span>
        <div className='graph-container'>
          {this.state.graph && <Graph graph={this.state.graph}/>}
        </div>
      </div>
    )
  }
}

const Div = () => (<div>
  abdfslj
</div>)
const Comp = withPanAndZoom(Div)

// ========================================

ReactDOM.render(<App />, document.getElementById('root'))
