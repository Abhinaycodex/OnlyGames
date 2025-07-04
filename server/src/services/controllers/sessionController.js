import Session from '../../models/Session.js'

// Book a new session
export const bookSession = async (req, res) => {
  try {
    const { creator, game, startTime, duration, price, meetingLink, notes } = req.body

    const session = new Session({
      creator,
      student: req.user.userId, // from auth middleware
      game,
      startTime,
      duration,
      price,
      meetingLink,
      notes
    })

    await session.save()
    res.status(201).json({ message: 'Session booked successfully', session })
  } catch (error) {
    res.status(500).json({ error: 'Failed to book session', details: error.message })
  }
}

// Get sessions for a user
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ creator: req.user.userId }, { student: req.user.userId }]
    }).sort({ startTime: -1 })

    res.status(200).json(sessions)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
}

// Update session status (e.g., to mark completed or cancelled)
export const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params
    const { status } = req.body

    const session = await Session.findById(sessionId)
    if (!session) return res.status(404).json({ error: 'Session not found' })

    if (
      session.creator.toString() !== req.user.userId &&
      session.student.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Unauthorized to update this session' })
    }

    session.status = status
    await session.save()

    res.status(200).json({ message: 'Session status updated', session })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session' })
  }
}
