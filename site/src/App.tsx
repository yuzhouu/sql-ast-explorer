import Editor from "@/components/Editor";
import SplitPane from "@/components/SplitPane";

function App() {
  return (
    <div className="App">
      <SplitPane>
        <Editor code={"SELECT name FROM users WHERE id = 1"} />
        <Editor code={"SELECT name FROM users WHERE id = 1"} />
      </SplitPane>
    </div>
  );
}

export default App;
