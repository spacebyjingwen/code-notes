import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Link } from 'react-router-dom';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = { note: null, view: 'viewNote' };
    this.deleteNote = this.deleteNote.bind(this);
    this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.cancelUpdate = this.cancelUpdate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.noteId) {
      fetch(`/api/notes/${this.props.match.params.noteId}`)
        .then(res => res.json())
        .then(data => this.setState({ note: data }))
        .catch(error => console.error(error));
    } else {
      this.setState({
        note: {
          createdAt: '',
          noteCode: {},
          noteContent: '',
          noteDifficulty: '',
          noteId: null,
          noteResource: [],
          noteTitle: 'Enter title here',
          notebookId: null,
          tags: []
        },
        view: 'createNote'
      });
    }
  }

  handleTitleChange(event) {
    this.setState({
      note: {
        ...this.state.note,
        noteTitle: event.target.value
      }
    });
  }

  handleDifficultyChange(number) {
    this.setState({
      note: {
        ...this.state.note,
        noteDifficulty: number
      }
    });
  }

  handleContentChange(event) {
    this.setState({
      note: {
        ...this.state.note,
        noteContent: event.target.value
      }
    });
  }

  deleteNote(noteId) {
    fetch(`/api/notes/${noteId}`, {
      method: 'DELETE'
    })
      .then(() => { this.setState({ view: 'deleteSuccess' }); })
      .catch(error => console.error(error));
  }

  cancelUpdate() {

  }

  handleEdit(noteId) {
    const newNote = this.state.note;
    fetch(`/api/notes/${noteId}`, {
      method: 'PATCH',
      header: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    })
      .then(res => res.json())
      .then(data => this.setState({ note: newNote }))
      .catch(error => console.error(error));
  }

  render() {
    const note = this.state.note;
    const view = this.state.view;
    let rightColumn = null;
    const justifyContent = this.state.view === 'viewNote' || this.state.view === 'createNote'
      ? 'justify-content-between' : 'justify-content-start';
    const closeButton = this.state.view === 'viewNote' ? '/notebook' : '/';

    if (view === 'deleteSuccess') {
      return (
        <>
          <header className="header-container d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <Link to="/" className="d-flex flex-row align-items-center col-1">
                <i className="fa fa-bars theme-green fa-2x header-hamburger-icon"></i>
              </Link>
              <Form className="ml-5">
                <FormGroup className="mb-0">
                  <Label for="noteTile"></Label>
                  <input
                    className="header-note-title"
                    type="text" name="noteTile"
                    id="noteTile"
                    defaultValue={note.noteTitle}
                    onChange={this.handleTitleChange} />
                </FormGroup>
              </Form>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-between col-2">
              <Form>
                <Input type="select" name="noteTags" id="noteTags">
                  <option defaultValue>Note Tag</option>
                  <option>Create new tag</option>
                </Input>
              </Form>
              <div className={`diff-status ml-4 diff-${note.noteDifficulty}`}></div>
              <Link to={{ pathname: closeButton }}>
                <Button className="d-flex flex-row align-items-center justify-content-center close-page-button ml-4">
                  <i className="fas fa-times"></i>
                </Button>
              </Link>
            </div>
          </header>
          <div className="note-page-container">
            <div className="note-delete">
              <h3>Your note has been deleted.</h3>
              <Link to="/notebook" className="notebooks-link">
                <Button className="solid-button mt-4">Back</Button>
              </Link>
            </div>
          </div>
        </>
      );
    }

    switch (view) {
      case 'viewNote':
        rightColumn = (
          <div className="d-flex flex-row align-items-center justify-content-center">
            <Button type="submit" className="solid-button" onSubmit={() => this.editNote}>Update</Button>
            <Button type="reset" className="solid-button ml-4">Cancel</Button>
            <Button className="solid-button ml-4" onClick={() => this.deleteNote(note.noteId)}>Delete</Button>
          </div>
        );
        break;
      case 'createNote':
        rightColumn = (
          <div className="d-flex flex-row align-items-center justify-content-center">
            <Button className="solid-button">Create</Button>
          </div>
        );
        break;
      case 'flashcard' :
        rightColumn = (
          <Form>
            <FormGroup className="mb-4">
              <Label for="flashcardQuestion" className="note-font-1">Enter Question:</Label>
              <Input type="textarea" name="flashcardQuestion" id="flashcardQuestion" />
            </FormGroup>
            <FormGroup className="mb-4">
              <Label for="flashcardAnswer" className="note-font-1">Enter Answer:</Label>
              <Input type="textarea" name="flashcardAnswer" id="flashcardAnswer" />
            </FormGroup>
            <div className="d-flex flex-row align-items-center justify-content-between">
              <FormGroup className="mb-5 flashcard-select-tag">
                <Label for="flashcardTag">Flashcard Tag:</Label>
                <Input type="select" name="flashcardTag" id="flashcardTag">
                  <option defaultValue>Select a Tag</option>
                  <option>Create new tag</option>
                </Input>
              </FormGroup>
              <Button className="solid-button-large ml-4">Make Flashcard</Button>
            </div>
            <div className="d-flex justify-content-center mt-4">
              <Button className="solid-button" onClick={() => this.setState({ view: 'viewNote' })}>Cancel</Button>
            </div>
          </Form>
        );
        break;
      case 'resource':
        rightColumn = (
          <Form>
            {
              note.noteResource.map((item, index) => {
                return (
                  <div key={index} className="d-flex flex-row align-items-center justify-content-between mb-2">
                    <FormGroup className="resource">
                      <Label for="resourceName">Resource Name</Label>
                      <Input type="text" name="resourceName" id="resourceName" placeholder="Name" defaultValue={item.name} />
                    </FormGroup>
                    <FormGroup className="resource-link">
                      <Label for="resourceLink">Link</Label>
                      <Input type="text" name="resourceLink" id="resourceLink" placeholder="Name" defaultValue={item.link} />
                    </FormGroup>
                  </div>
                );
              })
            }
            <Button className="add-button"><i className="fas fa-plus"></i></Button>
            <div className="d-flex flex-row align-items-center justify-content-center mt-4">
              <Button className="solid-button mr-4">Add</Button>
              <Button className="solid-button" onClick={() => this.setState({ view: 'viewNote' })}>Cancel</Button>
            </div>
          </Form>
        );
        break;
      case 'code':
        rightColumn = (
          <>
            <h3>HTML</h3>
            <p>{note.noteCode.html}</p>
            <h3>CSS</h3>
            <p>{note.noteCode.css}</p>
            <h3>JavaScript</h3>
            <p>{note.noteCode.javascript}</p>
          </>
        );
    }
    return note === null ? (null) : (
      <>
        <header className="header-container d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <Link to="/" className="d-flex flex-row align-items-center col-1">
              <i className="fa fa-bars theme-green fa-2x header-hamburger-icon"></i>
            </Link>
            <Form className="ml-5">
              <FormGroup className="mb-0">
                <Label for="noteTile"></Label>
                <input
                  className="header-note-title"
                  type="text" name="noteTile"
                  id="noteTile"
                  defaultValue={note.noteTitle}
                  onChange={this.handleTitleChange} />
              </FormGroup>
            </Form>
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between col-2">
            <Form>
              <Input type="select" name="noteTags" id="noteTags">
                <option defaultValue>Note Tag</option>
                <option>Create new tag</option>
              </Input>
            </Form>
            <div className={`diff-status ml-4 diff-${note.noteDifficulty}`}></div>
            <Link to={{ pathname: closeButton }}>
              <Button className="d-flex flex-row align-items-center justify-content-center close-page-button ml-4">
                <i className="fas fa-times"></i>
              </Button>
            </Link>
          </div>
        </header>
        <main className="note-page-container">
          <div className="col-6">
            <div className="d-flex flex-row align-items-center mb-4">
              <div className="note-font-1">Difficulty:</div>
              <button className="difficulty diff-1"
                onClick={() => this.handleDifficultyChange(1)}></button>
              <button className="difficulty diff-2"
                onClick={() => this.handleDifficultyChange(2)}></button>
              <button className="difficulty diff-3"
                onClick={() => this.handleDifficultyChange(3)}></button>
              <button className="difficulty diff-4"
                onClick={() => this.handleDifficultyChange(4)}></button>
              <button className="difficulty diff-5"
                onClick={() => this.handleDifficultyChange(5)}></button>
            </div>
            <Form>
              <FormGroup className="mb-4">
                <Label for="notebookName" className="note-font-1">Select Notebook:</Label>
                <Input type="select" name="notebookName" id="notebookName">
                  <option defaultValue>{note.noteId}</option>
                  <option>Create New Notebook</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="noteContent" className="note-font-1">Enter Note:</Label>
                <textarea
                  className="form-control note-content"
                  type="textarea"
                  name="noteContent"
                  id="noteContent"
                  defaultValue={note.noteContent}
                  onChange={this.handleContentChange}></textarea>
              </FormGroup>
            </Form>
          </div>
          <div className={`col-5 d-flex flex-column ${justifyContent}`}>
            <div className="note-top-button-group mb-4">
              <Button
                className="solid-button"
                onClick={() => this.setState({ view: 'flashcard' })}>Flashcard</Button>
              <Button
                className="solid-button ml-4"
                onClick={() => this.setState({ view: 'resource' })}>Resource</Button>
              <Button
                className="solid-button ml-4"
                onClick={() => this.setState({ view: 'code' })}>Code</Button>
            </div>
            {rightColumn}
          </div>
        </main>
      </>
    );
  }
}

export default Note;
