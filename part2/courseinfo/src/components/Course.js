import React from 'react';

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => <li>{part.name} {part.exercises}</li>

const Content = ({ parts }) =>
  <ul>
    {parts.map(part => <Part key={part.id} part={part} /> )}
  </ul>

const Course = ({course, parts}) => {
  const total = parts.reduce( (sum, part) => {return (sum + part.exercises)}, 0 )
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total sum={total} />
    </div>
  );
}

export default Course;