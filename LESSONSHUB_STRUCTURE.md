# LessonsHub - New Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVBAR                                  │
│                (Navigation - Always visible)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      📊 DASHBOARD                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Welcome back! 👋                          1,250 XP      │ │
│  │  Ready to master your debt collection skills?            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ 🎯 85%      │  │ ❤️ 78%      │  │ 🤝 90%      │           │
│  │ Persuasion  │  │ Empathy     │  │ Negotiation │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  💡 AI Recommendations                                    │ │
│  │  • Practice building rapport to improve persuasion       │ │
│  │  • Use empathetic language like "I understand"           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  📊 Recent Sessions                                       │ │
│  │  🎙️ Angry Alex        85 | 78 | 90                      │ │
│  │  💬 The Disputer      75 | 82 | 88                      │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              🎮 CHOOSE YOUR TRAINING MODE                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │              │  │              │  │              │         │
│  │   💬         │  │   🎙️        │  │   🧩         │         │
│  │              │  │              │  │              │         │
│  │  Chat Mode   │  │  Voice Mode  │  │   Puzzles    │         │
│  │              │  │              │  │              │         │
│  │ 6 Levels     │  │ 25 Personas  │  │ Story-based  │         │
│  │ Text-based   │  │ Voice + TTS  │  │ Challenges   │         │
│  │ AI Responses │  │ All Unlocked │  │ Levels       │         │
│  │              │  │              │  │              │         │
│  │  → Start     │  │  → Start     │  │  → Start     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              📚 REFERENCE MATERIALS                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 📖       │  │ 📍       │  │ 📞       │  │ ✅       │      │
│  │ Glossary │  │ State    │  │ Emergency│  │ Compliance│     │
│  │          │  │ Guide    │  │ Contacts │  │ Checklist│     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   🔒         │
                    │  God Mode    │
                    │  Toggle      │
                    └──────────────┘
                    (Bottom Left)
```

## Color Coding

### Training Modes
- **💬 Chat Mode**: Cyan/Blue gradient
- **🎙️ Voice Mode**: Purple/Pink gradient  
- **🧩 Puzzles**: Emerald/Green gradient

### Performance Metrics
- **Green (80%+)**: Excellent performance
- **Yellow (60-79%)**: Good, needs improvement
- **Red (<60%)**: Needs significant work

## Responsive Behavior

### Mobile (< 640px)
```
┌─────────────┐
│  Dashboard  │
├─────────────┤
│  Chat Mode  │
├─────────────┤
│ Voice Mode  │
├─────────────┤
│   Puzzles   │
├─────────────┤
│ Appendix A  │
│ Appendix B  │
├─────────────┤
│ Appendix C  │
│ Appendix D  │
└─────────────┘
```

### Tablet (640-768px)
```
┌─────────────────────┐
│     Dashboard       │
├─────────────────────┤
│ Chat  │ Voice │ Puzz│
├─────────────────────┤
│  App A  │  App B    │
│  App C  │  App D    │
└─────────────────────┘
```

### Desktop (768px+)
```
┌───────────────────────────────────┐
│          Dashboard                │
├───────────────────────────────────┤
│  Chat  │  Voice  │  Puzzles      │
├───────────────────────────────────┤
│ App A │ App B │ App C │ App D    │
└───────────────────────────────────┘
```

## Navigation Flow

```
LessonsHub (/)
    ├── Chat Mode (/lessons/2)
    │   ├── Level 1: First Contact
    │   ├── Level 2: Disputer
    │   ├── Level 3: Silent Treatment
    │   ├── Level 4: Negotiator
    │   ├── Level 5: Complex Case
    │   └── Level 6: Success Story
    │
    ├── Voice Mode (/lessons/8)
    │   ├── Beginner (1-5)
    │   ├── Intermediate (6-15)
    │   └── Advanced (16-25)
    │       └── All 25 Personas Unlocked
    │
    ├── Puzzles (/lessons/1)
    │   ├── Story-based Scenarios
    │   └── Multiple Levels
    │
    └── Appendixes
        ├── /appendix/a (Glossary)
        ├── /appendix/b (State Guide)
        ├── /appendix/c (Contacts)
        └── /appendix/d (Checklist)
```

## User Journey

1. **Land on Hub** → See Dashboard with performance metrics
2. **Review Stats** → Check Persuasion, Empathy, Negotiation scores
3. **Read Recommendations** → Get personalized AI suggestions
4. **Choose Mode** → Select Chat, Voice, or Puzzles
5. **Practice** → Complete sessions and get feedback
6. **Return to Hub** → See updated stats and recommendations
7. **Reference Materials** → Access appendixes as needed

## Key Features Summary

### Dashboard Component
- Performance tracking (3 key metrics)
- Recent session history
- AI-powered recommendations
- XP display
- Progress visualization

### Training Modes
1. **Chat Mode**: 6 levels, text-based, AI responses
2. **Voice Mode**: 25 personas, voice I/O, all unlocked
3. **Puzzles**: Story scenarios, decision-making, levels

### Additional Features
- God Mode toggle (unlock all)
- Reference materials (4 appendixes)
- Fully responsive design
- Smooth animations
- Color-coded interface
- Touch-friendly mobile UI
