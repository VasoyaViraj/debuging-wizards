export const getWaterAlert = (req, res) => {
  const { location, severity } = req.body;

  res.json({
    service: "agriculture",
    action: "farmers_notified",
    location,
    severity,
    message: `Farmers alerted about water shortage in ${location}`
  });
}

export const sendAdvisory = (req,res) => {
    const {crop,advisory} = req.body;
  res.json({
    service: "agriculture",
    type: "advisory",
    crop,
    advisory,
    message: "Advisory broadcasted to registered farmers",
    timestamp: new Date().toISOString()
  });
};