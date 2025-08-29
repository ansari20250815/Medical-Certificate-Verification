import React from 'react';
import PropTypes from 'prop-types';
import '../ManagerDashboard.css'; // Make sure the CSS file exists

const SummaryCard = ({ title, value }) => {
  return (
    <div className="summary-card">
      <div className="summary-title">{title}</div>
      <div className="summary-value">{value}</div>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SummaryCard;
