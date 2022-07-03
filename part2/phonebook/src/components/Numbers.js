const Numbers = ({ person, deletePerson }) =>  <li>{person.name} {person.number} <button onClick={deletePerson}>Delete</button> </li>

export default Numbers;