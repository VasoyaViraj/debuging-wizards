import Advisory from '../models/Advisory.model.js';

// Static advisory responses (placeholder for Gemini integration)
const generateStaticAdvisory = (cropType, problemDescription) => {
  const advisories = {
    rice: `Based on your query about rice cultivation:

1. **Water Management**: Ensure proper water levels of 2-5 inches during vegetative stage. Drain fields 2-3 weeks before harvest.

2. **Pest Control**: Monitor for rice stem borers and brown plant hoppers. Consider neem-based organic pesticides.

3. **Fertilizer Application**: Apply NPK 120:60:40 kg/ha in split doses - 50% N as basal, 25% at tillering, 25% at panicle initiation.

4. **Disease Prevention**: Watch for blast and bacterial leaf blight. Maintain proper spacing for air circulation.

For your specific concern: "${problemDescription}" - we recommend consulting with your local agricultural extension officer for field-specific guidance.`,

    wheat: `Advisory for wheat cultivation:

1. **Sowing Time**: Optimal sowing is between mid-November to early December. Late sowing reduces yield by 25-30 kg/day.

2. **Irrigation**: Provide 4-6 irrigations at crown root, tillering, jointing, flowering, and grain filling stages.

3. **Weed Management**: Apply pre-emergence herbicides within 2-3 days of sowing.

4. **Nutrient Management**: Apply 120-150 kg N, 60 kg P2O5, and 40 kg K2O per hectare.

Regarding your concern: "${problemDescription}" - proper field inspection is recommended.`,

    corn: `Corn/Maize cultivation advisory:

1. **Spacing**: Maintain 60-75 cm between rows and 20-25 cm between plants for optimal yield.

2. **Fertilization**: Apply 120-150 kg N/ha in 3 split doses - basal, knee-high stage, and tasseling.

3. **Irrigation**: Critical stages are tasseling and grain filling. Stress during these stages can reduce yield by 50%.

4. **Pest Watch**: Monitor for fall armyworm and stem borer. Use pheromone traps for early detection.

For "${problemDescription}" - we suggest immediate field assessment.`,

    vegetables: `Vegetable cultivation advisory:

1. **Raised Beds**: Create raised beds 15-20 cm high for better drainage and root development.

2. **Organic Matter**: Incorporate 20-25 tons of well-decomposed FYM per hectare before planting.

3. **Integrated Pest Management**: Use yellow sticky traps, neem oil sprays, and biological controls.

4. **Harvesting**: Harvest at proper maturity for best quality. Morning harvesting ensures longer shelf life.

Addressing "${problemDescription}" requires variety-specific recommendations.`,

    fruits: `Fruit orchard advisory:

1. **Pruning**: Regular pruning improves light penetration and fruit quality. Prune during dormant season.

2. **Nutrition**: Apply micronutrients (Zn, B, Fe) through foliar sprays during pre-flowering stage.

3. **Mulching**: Apply organic mulch 4-6 inches thick to conserve moisture and suppress weeds.

4. **Pest Management**: Install fruit fly traps and spray approved insecticides at proper intervals.

For "${problemDescription}" - orchard-specific inspection is advised.`,

    cotton: `Cotton cultivation advisory:

1. **Variety Selection**: Choose BT cotton varieties suited to your agro-climatic zone.

2. **Spacing**: Maintain 90-120 cm row spacing and 45-60 cm plant spacing.

3. **Pest Management**: Scout regularly for bollworms, aphids, and whiteflies. Follow refuge strategy for BT cotton.

4. **Defoliation**: Apply defoliants 10-14 days before picking for cleaner harvest.

Regarding "${problemDescription}" - field-level assessment recommended.`,

    other: `General agricultural advisory:

1. **Soil Testing**: Get soil tested before each season for accurate fertilizer recommendations.

2. **Crop Rotation**: Practice crop rotation to maintain soil health and break pest cycles.

3. **Water Conservation**: Adopt drip irrigation or sprinkler systems for water efficiency.

4. **Record Keeping**: Maintain farm records for better planning and government scheme eligibility.

For your query "${problemDescription}" - please visit your nearest Krishi Vigyan Kendra for detailed guidance.`
  };

  return advisories[cropType] || advisories.other;
};

// Process advisory request from Nexus Gateway
export const processAdvisory = async (req, res) => {
  try {
    const { requestId, citizenId, citizenName, citizenEmail, data } = req.body;

    // Generate advisory text (static for now, Gemini placeholder)
    const advisoryText = generateStaticAdvisory(data.cropType, data.problemDescription);

    // Create advisory in Agriculture database
    const advisory = new Advisory({
      nexusRequestId: requestId,
      citizenId,
      citizenName,
      citizenEmail,
      cropType: data.cropType,
      location: data.location,
      landSize: data.landSize,
      problemDescription: data.problemDescription,
      advisoryText,
      status: 'ACCEPTED' // Auto-accept for advisory service
    });

    await advisory.save();

    // Return response to Nexus
    res.json({
      success: true,
      status: 'ACCEPTED',
      remarks: 'Your advisory request has been processed.',
      responseData: {
        advisoryId: advisory._id,
        advisoryText,
        cropType: advisory.cropType,
        location: advisory.location
      }
    });
  } catch (error) {
    console.error('Process advisory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process advisory request.'
    });
  }
};

// Update advisory status
export const updateAdvisoryStatus = async (req, res) => {
  try {
    const { requestId, status, remarks, processedBy } = req.body;

    const advisory = await Advisory.findOne({ nexusRequestId: requestId });

    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found.'
      });
    }

    advisory.status = status;
    advisory.remarks = remarks || '';
    advisory.processedBy = processedBy;
    advisory.processedAt = new Date();

    await advisory.save();

    res.json({
      success: true,
      message: 'Advisory status updated.',
      data: advisory
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update advisory status.'
    });
  }
};

// Get citizen's advisories
export const getCitizenAdvisories = async (req, res) => {
  try {
    const citizenId = req.headers['x-citizen-id'] || req.query.citizenId;

    const advisories = await Advisory.find({ citizenId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: advisories
    });
  } catch (error) {
    console.error('Get citizen advisories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisories.'
    });
  }
};

// Get all advisories (for department officers)
export const getAllAdvisories = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};

    const advisories = await Advisory.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: advisories
    });
  } catch (error) {
    console.error('Get all advisories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch advisories.'
    });
  }
};

// Legacy exports
export const sendAdvisory = processAdvisory;
export const getWaterAlert = (req, res) => {
  res.json({
    success: true,
    message: 'Water alert endpoint - deprecated',
    data: { alert: 'Check local weather station for water advisories' }
  });
};