function CastList({ cast }) {
    return (
        <ul className="cast-list">
            {cast.map((member) => (
                <li key={`${member.person.id}-${member.character.id}`}>
                    {member.person.name} as {member.character.name}
                </li>
            ))}
        </ul>
    );
}

export default CastList