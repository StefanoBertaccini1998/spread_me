import './ProfileCardItem.css';

const ProfileCardItem = ({ icon, name, color, balance }) => {
    return (
        <div className="profile-card-item" style={{ backgroundColor: color }}>
            <div className="profile-card-top">
                <span className="profile-card-icon">{icon}</span>
                <span className="profile-card-name" title={name}>{name}</span>
            </div>
            {balance !== undefined && (
                <div className="profile-card-balance">
                    €{parseFloat(balance).toFixed(2)}
                </div>
            )}
        </div>
    );
};

export default ProfileCardItem;
