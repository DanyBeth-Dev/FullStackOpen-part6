import { useState, useEffect } from 'react';
import Numbers from './components/Numbers';
import PersonForm from './components/PersonForm';
import Search from './components/Search';
import Notification from './components/Notification'
import personService from './services/persons'
import './index.css'

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, []);

  const deleteMessage = () => {
    setTimeout(() => {
      setMessage(null)
      setError(false)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const alreadyExits = persons.filter(p => p.name === event.target[0].value)
    if (alreadyExits[0]) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === event.target[0].value)
        const changedPerson = { ...person, number: event.target[1].value }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson)))
          .then(setMessage(`${event.target[0].value} was updated`))
          .then(deleteMessage)
          .catch(error => {
            setError(true)
            setMessage(`The person ${event.target[0].value} was already deleted from server: `, error.response.data.error);
            deleteMessage()
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      };
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('');
          setNewNumber('');
          setMessage(`${event.target[0].value} was added`);
          deleteMessage();
        })
        .catch(error => {
          setError(true)
          setMessage(error.response.data.error)
          deleteMessage()
        })
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = () => {
    var input = document.getElementById("myInput").value.toUpperCase();
    var li = document.getElementById("myUL").getElementsByTagName("li");
    for (var i = 0; i < li.length; i++) {
      var txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  const deletePerson = id => {
    let personToDelete = persons.filter(person => person.id === id)
    if (window.confirm(`Delete ${personToDelete[0].name}?`)) {
      personService
        .deletePerson(id)
        .then(() => setPersons(persons.filter(person => person.id !== id)))
        .then(setMessage(`${personToDelete[0].name} was deleted`))
        .then(deleteMessage)
    }
  }



  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} error={error} />
      <h2>Search:</h2>
      <Search handleSearch={handleSearch} />
      <h2>Add a new:</h2>
      <PersonForm addPerson={addPerson} newName={newName} handlePersonChange={handlePersonChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers:</h2>
      <ul id="myUL">{persons.map(person => <Numbers key={person.id} person={person} deletePerson={() => deletePerson(person.id)} />)}</ul>
    </div>
  );
};

export default App;
