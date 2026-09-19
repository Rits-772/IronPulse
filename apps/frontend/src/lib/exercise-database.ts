export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Shoulders' 
  | 'Arms' 
  | 'Legs' 
  | 'Core' 
  | 'Olympic & Functional';

export type EquipmentType = 
  | 'Barbell' 
  | 'Dumbbell' 
  | 'Cable' 
  | 'Machine' 
  | 'Bodyweight' 
  | 'Kettlebell' 
  | 'Resistance Band' 
  | 'Other';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';

export type ExerciseCategory = 'Strength' | 'Hypertrophy' | 'Power' | 'Endurance' | 'Mobility';

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  category: ExerciseCategory;
  instructions: string[];
  benefits: string[];
  tips: string[];
}

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // ==========================================
  // CHEST (PECTORAL PROTOCOLS)
  // ==========================================
  {
    id: 'ch-01',
    name: 'Barbell Flat Bench Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Mid/Lower)'],
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Lie flat on the bench with your eyes directly under the racked bar.',
      'Grip the bar slightly wider than shoulder-width with wrists locked straight.',
      'Unrack the bar, depress and retract your scapulae, creating a stable arch in your upper back.',
      'Lower the bar under control to the lower-to-mid sternum, keeping elbows tucked at roughly 45-70 degrees.',
      'Drive the barbell forcefully upwards until arms reach extension without losing shoulder retraction.'
    ],
    benefits: [
      'Maximum motor unit recruitment for the sternal head of the pectorals.',
      'Fundamental compound movement for raw upper-body pushing power.',
      'High loading potential allowing progressive overload over decades.'
    ],
    tips: [
      'Maintain strong leg drive into the floor to stabilize your entire kinetic chain.',
      'Do not allow your wrists to hyper-extend under heavy loads.'
    ]
  },
  {
    id: 'ch-02',
    name: 'Incline Barbell Bench Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Clavicular Head)'],
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Set bench angle to approximately 30 degrees (avoid higher angles to prevent excessive front delt takeover).',
      'Plant feet firmly and grip barbell slightly outside shoulder-width.',
      'Lower the bar smoothly toward the upper chest just below the collarbone.',
      'Press explosively along a slight backward curve to lock out above the upper chest.'
    ],
    benefits: [
      'Targeted hypertrophy for upper chest fullness and clavicular fiber recruitment.',
      'Balances push volume against standard flat pressing.'
    ],
    tips: [
      'Keep your shoulder blades pinched together throughout the entire descent.'
    ]
  },
  {
    id: 'ch-03',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Upper)'],
    secondaryMuscles: ['Anterior Deltoid', 'Triceps Brachii'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Set bench to 30-45 degrees. Kick dumbbells up to starting position over shoulders.',
      'Lower dumbbells with control, allowing a deep pectoral stretch at the bottom.',
      'Converge the dumbbells upward in an arc without smashing them at the top.'
    ],
    benefits: [
      'Greater active range of motion than barbell variations.',
      'Eliminates bilateral strength imbalances and joint strain.'
    ],
    tips: [
      'Keep wrists stacked directly over elbows during the press.'
    ]
  },
  {
    id: 'ch-04',
    name: 'Flat Dumbbell Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit on flat bench with dumbbells on thighs. Kick back smoothly into position.',
      'Lower weights until dumbbells align with chest level for a full stretch.',
      'Drive dumbbells up, contracting pectorals at peak contraction.'
    ],
    benefits: [
      'Allows neutral or semi-pronated grip friendly to shoulder impingement.',
      'Independent arm loading builds stabilization endurance.'
    ],
    tips: [
      'Control the eccentric lowering phase for 2-3 seconds for maximum hypertrophy.'
    ]
  },
  {
    id: 'ch-05',
    name: 'Standing Cable Crossover',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Sternal & Costal)'],
    secondaryMuscles: ['Anterior Deltoid', 'Biceps Short Head'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Position pulleys above head height. Grab handles and step forward in a staggered stance.',
      'Slightly bend elbows and maintain rigid torso position.',
      'Bring hands together in a downward hugging arc, squeezing chest hard at bottom peak.'
    ],
    benefits: [
      'Continuous tension throughout both stretch and shortened peak contraction.',
      'Isolated muscle fatigue with low systemic nervous system fatigue.'
    ],
    tips: [
      'Do not let shoulders roll forward at peak contraction.'
    ]
  },
  {
    id: 'ch-06',
    name: 'Low-to-High Cable Fly',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Clavicular Head)'],
    secondaryMuscles: ['Anterior Deltoid'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Set pulleys at lowest position. Grab handles with palms facing up/forward.',
      'With elbows slightly flexed, drive hands up and inward across chest height.',
      'Pause for 1 second at the peak apex to maximize upper pectoral contraction.'
    ],
    benefits: [
      'Aligned directly with upper pectoral fiber orientation.',
      'Creates intense metabolic burn without taxing the rotator cuff.'
    ],
    tips: [
      'Focus on bringing your inner biceps together rather than just your hands.'
    ]
  },
  {
    id: 'ch-07',
    name: 'Weighted Chest Dips',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Lower/Costal)'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Grip parallel dip bars, lean torso forward at roughly 30-45 degrees, flared elbows slightly outward.',
      'Descend until upper arms are parallel to the floor or slightly below.',
      'Drive upward through palms, squeezing chest to the lockout.'
    ],
    benefits: [
      'Highest EMG activation for lower pectoral fiber thickness.',
      'Exceptional calisthenic compound for building chest density.'
    ],
    tips: [
      'Avoid upright posture which shifts tension primarily to triceps.'
    ]
  },
  {
    id: 'ch-08',
    name: 'Machine Chest Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major'],
    secondaryMuscles: ['Triceps Brachii', 'Anterior Deltoid'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Adjust seat height so handles align with mid-chest.',
      'Keep back flat against pad, retract shoulder blades, and press forward smoothly.',
      'Return to starting stretch position without letting weight stack slam.'
    ],
    benefits: [
      'Fixed convergent path maximizes isolation and safety when training to absolute failure.',
      'Minimal stabilizer recruitment allows high volume overload.'
    ],
    tips: [
      'Great as a final burnout exercise after free weights.'
    ]
  },
  {
    id: 'ch-09',
    name: 'Pec Deck Fly Machine',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Sternal Head)'],
    secondaryMuscles: ['Anterior Deltoid'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit with back against pad, adjust seat so arms are parallel with floor.',
      'Push pads or handles together in a sweeping motion, holding 1 second at peak.',
      'Slowly open arms wide to achieve a full stretch across the chest.'
    ],
    benefits: [
      'Pure single-joint isolation eliminating tricep fatigue bottleneck.',
      'Optimal for mind-muscle connection and mind-muscle synchronization.'
    ],
    tips: [
      'Do not allow shoulders to shrug up toward ears.'
    ]
  },
  {
    id: 'ch-10',
    name: 'Decline Barbell Bench Press',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Lower Head)'],
    secondaryMuscles: ['Triceps Brachii'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Hook legs securely in decline bench leg rolls. Lie back and grasp bar shoulder-width.',
      'Lower bar to lower chest just below nipples.',
      'Press bar straight up to full arm extension.'
    ],
    benefits: [
      'Reduces shoulder impingement angle compared to flat bench.',
      'Allows heavier loading due to shorter mechanical range of motion.'
    ],
    tips: [
      'Always use a spotter or power rack safety pins on decline benches.'
    ]
  },
  {
    id: 'ch-11',
    name: 'Dumbbell Pullover',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major', 'Serratus Anterior'],
    secondaryMuscles: ['Latissimus Dorsi', 'Triceps Long Head'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Lie perpendicular across a flat bench with upper back resting on the pad.',
      'Hold a single dumbbell with both hands in diamond grip above chest.',
      'Lower dumbbell back over head with slight elbow bend until a deep ribcage stretch is felt.',
      'Pull dumbbell back over chest using chest and serratus contraction.'
    ],
    benefits: [
      'Expands ribcage cage mechanics and strengthens the serratus anterior.',
      'Unique stretch under load across thoracic spine.'
    ],
    tips: [
      'Keep hips slightly dipped to anchor the stretch.'
    ]
  },
  {
    id: 'ch-12',
    name: 'Diamond Pushups',
    muscleGroup: 'Chest',
    primaryMuscles: ['Pectoralis Major (Inner fibers)', 'Triceps Brachii'],
    secondaryMuscles: ['Core', 'Anterior Deltoid'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    category: 'Endurance',
    instructions: [
      'Set up in standard pushup position with index fingers and thumbs touching in a diamond shape.',
      'Lower chest under control directly to touch diamond hands.',
      'Press up explosively while engaging core and glutes.'
    ],
    benefits: [
      'High inner-chest and tricep recruitment without equipment.',
      'Builds wrist and shoulder stability.'
    ],
    tips: [
      'Flare elbows slightly if you experience wrist discomfort.'
    ]
  },

  // ==========================================
  // BACK (POSTERIOR CHAIN & LATS)
  // ==========================================
  {
    id: 'bk-01',
    name: 'Conventional Barbell Deadlift',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Erector Spinae', 'Trapezius', 'Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Forearms', 'Core', 'Quadriceps'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot. Shins 1 inch from bar.',
      'Hinge hips back, grip bar just outside knees (double overhand or hook grip).',
      'Engage lats by pulling the slack out of the barbell ("bend the bar around your shins").',
      'Drive through the floor with legs, driving hips forward into lockout with neutral spine.'
    ],
    benefits: [
      'The ultimate total-body kinetic strength and posterior chain thickness builder.',
      'Huge release of systemic anabolic and neuro-endocrine response.',
      'Builds unbreakable spinal stability and grip strength.'
    ],
    tips: [
      'Never round your lumbar spine under load; brace core tightly (valsalva maneuver).'
    ]
  },
  {
    id: 'bk-02',
    name: 'Overhand Barbell Bent-Over Row',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Middle Trapezius'],
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids', 'Erector Spinae'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Hinge forward at hips until torso is roughly 45 degrees to floor, spine neutral.',
      'Grip bar slightly wider than shoulder-width with overhand grip.',
      'Pull the barbell to the lower sternum/belly button, driving elbows back and squeezing shoulder blades together.',
      'Lower the bar under control without bobbing the torso.'
    ],
    benefits: [
      'Builds massive mid-back thickness and lat width simultaneously.',
      'Reinforces static isometric endurance in the lumbar spine.'
    ],
    tips: [
      'Avoid using excessive body momentum to heave the weight up.'
    ]
  },
  {
    id: 'bk-03',
    name: 'Pendlay Row',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius'],
    secondaryMuscles: ['Erector Spinae', 'Biceps'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    category: 'Power',
    instructions: [
      'Set torso strictly parallel to the floor with bar resting on the floor for each rep.',
      'Explosively row the bar from a dead stop into the lower chest.',
      'Return the bar completely to the ground to reset before initiating next rep.'
    ],
    benefits: [
      'Builds explosive pulling power from a dead stop (zero momentum).',
      'Develops strict posterior chain positioning.'
    ],
    tips: [
      'Do not elevate torso angle during the explosive pull.'
    ]
  },
  {
    id: 'bk-04',
    name: 'Weighted Pull-Ups',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
    secondaryMuscles: ['Biceps Brachii', 'Brachialis', 'Lower Trapezius', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Grip bar with overhand grip slightly wider than shoulder-width.',
      'Hang with arms fully extended (dead hang) and engage scapular depressors.',
      'Pull chest up to the bar until chin clears the bar cleanly, driving elbows down into ribs.',
      'Lower with strict control back to full dead hang.'
    ],
    benefits: [
      'The gold standard upper-body vertical pulling exercise.',
      'Develops the iconic wide V-taper lat silhouette.'
    ],
    tips: [
      'Avoid swinging or kipping legs; cross ankles and tense glutes/abs.'
    ]
  },
  {
    id: 'bk-05',
    name: 'Wide-Grip Lat Pulldown',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi', 'Teres Major'],
    secondaryMuscles: ['Biceps Brachii', 'Rhomboids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit with thighs anchored firmly under foam pads.',
      'Grip wide bar with overhand grip outside bend. Lean back roughly 10-15 degrees.',
      'Pull bar down smoothly to upper chest, leading with elbows and retracting scapulae.',
      'Slowly allow the bar to ascend, feeling the deep stretch in the upper lats.'
    ],
    benefits: [
      'Controlled vertical pulling without bodyweight load limitations.',
      'Excellent for high-rep hypertrophy dropsets.'
    ],
    tips: [
      'Do not lean excessively back to turn it into a horizontal row.'
    ]
  },
  {
    id: 'bk-06',
    name: 'Seated Cable Row (Close Grip)',
    muscleGroup: 'Back',
    primaryMuscles: ['Rhomboids', 'Middle Trapezius', 'Latissimus Dorsi'],
    secondaryMuscles: ['Biceps Brachii', 'Rear Deltoids'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit on cable row bench with feet on footplates, knees slightly bent.',
      'Grab V-bar handle and sit upright with straight spine.',
      'Pull handle toward belly button, pinching shoulder blades together tightly at end range.',
      'Extend arms back out under control, letting lats stretch forward slightly.'
    ],
    benefits: [
      'Constant cable tension throughout horizontal pull plane.',
      'Builds dense mid-back rhomboid and trap musculature.'
    ],
    tips: [
      'Keep chest up and avoid rounding shoulders forward during the pull.'
    ]
  },
  {
    id: 'bk-07',
    name: 'Single-Arm Dumbbell Row',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi'],
    secondaryMuscles: ['Biceps', 'Rhomboids', 'Posterior Deltoid'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Place one knee and same-side hand on flat bench for support. Torso horizontal.',
      'Grip dumbbell with free hand, arm hanging straight down.',
      'Row dumbbell up toward hip in a slight J-curve path, keeping elbow close to side.',
      'Lower dumbbell under control to a deep lat stretch.'
    ],
    benefits: [
      'Allows huge range of motion and direct unilateral focus per lat side.',
      'Takes axial load off the lower spine.'
    ],
    tips: [
      'Pull your elbow toward your hip pocket rather than straight up to your shoulder.'
    ]
  },
  {
    id: 'bk-08',
    name: 'Chest-Supported T-Bar Row',
    muscleGroup: 'Back',
    primaryMuscles: ['Middle Trapezius', 'Rhomboids', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Deltoid'],
    equipment: 'Machine',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Lie face down on pad with upper chest resting on the support cushion.',
      'Grab handles with neutral or overhand grip.',
      'Row handles upward, driving elbows high and back until chest lifts slightly from pad.',
      'Lower slowly to full arm stretch.'
    ],
    benefits: [
      'Zero lumbar/lower back strain allows 100% effort to back muscle failure.',
      'Incredible mid-back and upper-back trap hypertrophy.'
    ],
    tips: [
      'Keep your sternum glued to the pad to avoid hip compensation.'
    ]
  },
  {
    id: 'bk-09',
    name: 'Straight-Arm Cable Pulldown',
    muscleGroup: 'Back',
    primaryMuscles: ['Latissimus Dorsi (Lower/Outer)'],
    secondaryMuscles: ['Teres Major', 'Triceps Long Head', 'Core'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Stand facing high cable with straight bar attachment. Step back and hinge hips slightly.',
      'With arms straight (micro-bend in elbows), pull bar down in an arc to thighs.',
      'Squeeze lats intensely at bottom, then slowly return to overhead stretch.'
    ],
    benefits: [
      'Complete isolation of lats without any bicep involvement.',
      'Teaches lat activation and mind-muscle connection.'
    ],
    tips: [
      'Do not bend elbows during the downward sweep.'
    ]
  },
  {
    id: 'bk-10',
    name: 'Face Pulls with Rope',
    muscleGroup: 'Back',
    primaryMuscles: ['Rear Deltoid', 'Rhomboids', 'Rotator Cuff (Infraspinatus, Teres Minor)'],
    secondaryMuscles: ['Trapezius'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Mobility',
    instructions: [
      'Set cable pulley at eye level with rope attachment.',
      'Hold rope ends with neutral thumbs-back grip and step back.',
      'Pull rope towards nose/forehead, flaring elbows out and externally rotating shoulders so thumbs end up behind ears.',
      'Hold 1 second and slowly return.'
    ],
    benefits: [
      'Essential structural longevity and rotator cuff health.',
      'Counters internal rotation posture caused by heavy pressing.'
    ],
    tips: [
      'Focus on external rotation at the finish, not just pulling weight back.'
    ]
  },
  {
    id: 'bk-11',
    name: 'Barbell Shrugs',
    muscleGroup: 'Back',
    primaryMuscles: ['Upper Trapezius', 'Levator Scapulae'],
    secondaryMuscles: ['Forearms', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Hold barbell in front of thighs with shoulder-width overhand grip.',
      'Elevate shoulders directly toward ears in a straight vertical line.',
      'Hold peak squeeze for 2 full seconds, then lower under complete control.'
    ],
    benefits: [
      'Builds massive upper neck and collarbone trap thickness.',
      'Enhances heavy carrying and deadlift lockouts.'
    ],
    tips: [
      'Never roll your shoulders in circles; only shrug straight up and down.'
    ]
  },
  {
    id: 'bk-12',
    name: 'Hyperextensions (Back Extensions)',
    muscleGroup: 'Back',
    primaryMuscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Core'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Endurance',
    instructions: [
      'Position yourself in 45-degree hyperextension bench with thigh pad just below hips.',
      'Cross arms across chest and lower torso down until 90-degree flexion is reached.',
      'Contract glutes and lower back erectors to raise torso until body forms a straight line.'
    ],
    benefits: [
      'Strengthens spinal erectors and fortifies lower back against injury.',
      'Can be loaded with weight plates for progressive overload.'
    ],
    tips: [
      'Do not hyperextend past neutral at the top of the movement.'
    ]
  },

  // ==========================================
  // SHOULDERS (DELTOID PROTOCOLS)
  // ==========================================
  {
    id: 'sh-01',
    name: 'Standing Overhead Barbell Press (OHP)',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Serratus Anterior', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Stand with feet shoulder-width, bar resting across front delts and collarbone.',
      'Squeeze glutes and brace core tightly to avoid lumbar hyperextension.',
      'Press bar vertically, tilting head slightly back until bar clears forehead, then pushing head through ("window") under the bar at lockout.'
    ],
    benefits: [
      'The foundational vertical pressing compound for shoulder mass and core stability.',
      'Develops powerful overhead lockout strength.'
    ],
    tips: [
      'Keep glutes clenched throughout to prevent lower back hyperextension.'
    ]
  },
  {
    id: 'sh-02',
    name: 'Seated Dumbbell Shoulder Press',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Sit on bench with back support angled at 75-85 degrees.',
      'Kick dumbbells to shoulder level with palms facing forward or slightly angled.',
      'Press dumbbells upward until arms extend, without clanking weights at top.',
      'Lower under control until dumbbells touch or hover just above shoulders.'
    ],
    benefits: [
      'Allows high load targeting without requiring balance/core fatigue.',
      'Safer wrist and shoulder path than fixed bar.'
    ],
    tips: [
      'Keep back flat against the backrest throughout.'
    ]
  },
  {
    id: 'sh-03',
    name: 'Arnold Press',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Anterior Deltoid', 'Lateral Deltoid'],
    secondaryMuscles: ['Triceps', 'Rotator Cuff'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Hold dumbbells in front of upper chest with palms facing your face (supinated).',
      'As you press upward, rotate wrists outward so palms face forward at full overhead extension.',
      'Reverse the rotational movement during the descent back to starting face-level.'
    ],
    benefits: [
      'Increased time under tension across entire deltoid head arc.',
      'Hits anterior and lateral heads in a single fluid rotation.'
    ],
    tips: [
      'Execute with smooth, deliberate rotation rather than sudden jerks.'
    ]
  },
  {
    id: 'sh-04',
    name: 'Standing Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Lateral Deltoid'],
    secondaryMuscles: ['Anterior Deltoid', 'Upper Trapezius'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Stand with dumbbells at sides, slight forward torso lean, elbows with a 15-degree bend.',
      'Raise dumbbells out to sides in scapular plane (30 degrees forward) until parallel to floor.',
      'Lead with elbows, keeping pinkies slightly higher than thumbs ("pouring water").',
      'Lower slowly over 2-3 seconds.'
    ],
    benefits: [
      'The #1 exercise for building wide, 3D boulder shoulders.',
      'Directly isolates the side deltoid head.'
    ],
    tips: [
      'Do not shrug your neck up; keep traps depressed to isolate lateral delt.'
    ]
  },
  {
    id: 'sh-05',
    name: 'Single-Arm Cable Lateral Raise',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Lateral Deltoid'],
    secondaryMuscles: ['Supraspinatus'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Set pulley at knee or lowest height. Stand beside machine and grab handle across body.',
      'Lean slightly away from the machine to increase stretch angle.',
      'Raise arm out to the side until parallel to floor, pause for 1 second, and lower slowly.'
    ],
    benefits: [
      'Fixes the dumbbell dead-zone by providing continuous tension at the bottom stretch.',
      'Flawless biomechanical resistance curve.'
    ],
    tips: [
      'Use cuff attachments around wrist to remove grip fatigue.'
    ]
  },
  {
    id: 'sh-06',
    name: 'Reverse Pec Deck / Rear Delt Fly',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Posterior Deltoid'],
    secondaryMuscles: ['Rhomboids', 'Middle Trapezius'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit facing chest pad, handles at shoulder height.',
      'Grab handles with neutral or pronated grip with slight elbow bend.',
      'Drive arms back in horizontal abduction arc until hands are in line with shoulders.',
      'Hold peak squeeze for 1 second, return slowly.'
    ],
    benefits: [
      'Crucial for balanced shoulder 3D spherical look and shoulder health.',
      'Direct rear delt isolation with constant guided tension.'
    ],
    tips: [
      'Keep shoulders depressed and do not pinch shoulder blades excessively early.'
    ]
  },
  {
    id: 'sh-07',
    name: 'Barbell Upright Row',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Lateral Deltoid', 'Upper Trapezius'],
    secondaryMuscles: ['Biceps', 'Brachialis'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Grip barbell with shoulder-width overhand grip (avoid narrow grip to save wrists).',
      'Pull bar vertically up along torso, leading with elbows until bar reaches mid-chest.',
      'Lower under control to full arm extension.'
    ],
    benefits: [
      'High loading potential for side delts and upper traps combined.',
      'Dynamic multi-joint pulling volume.'
    ],
    tips: [
      'Stop when elbows reach shoulder height; pulling higher increases impingement risk.'
    ]
  },
  {
    id: 'sh-08',
    name: 'Bent-Over Dumbbell Rear Delt Raise',
    muscleGroup: 'Shoulders',
    primaryMuscles: ['Posterior Deltoid'],
    secondaryMuscles: ['Rhomboids', 'Traps'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Hinge at hips until torso is parallel with floor, arms hanging down with dumbbells.',
      'Raise dumbbells out to sides with slight elbow bend, focusing on rear delts.',
      'Lower smoothly without bouncing torso.'
    ],
    benefits: [
      'Requires zero machines; perfect for home or free-weight zones.',
      'Great auxiliary posterior volume.'
    ],
    tips: [
      'Think of pushing the weights toward the back corners of the room.'
    ]
  },

  // ==========================================
  // ARMS (BICEPS, TRICEPS & FOREARMS)
  // ==========================================
  {
    id: 'arm-01',
    name: 'Standing Barbell Bicep Curl',
    muscleGroup: 'Arms',
    primaryMuscles: ['Biceps Brachii (Short & Long Heads)'],
    secondaryMuscles: ['Brachialis', 'Forearm Flexors'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    category: 'Strength',
    instructions: [
      'Stand upright with shoulder-width underhand grip on barbell, elbows pinned at sides.',
      'Curl the bar upwards in an arc, squeezing biceps hard at top without shifting elbows forward.',
      'Lower under control for 2-3 seconds until arms are fully extended.'
    ],
    benefits: [
      'The king of bicep mass and overload capability.',
      'Trains both heads of the bicep under heavy loading.'
    ],
    tips: [
      'Do not swing your lower back to generate momentum.'
    ]
  },
  {
    id: 'arm-02',
    name: 'Incline Dumbbell Curl',
    muscleGroup: 'Arms',
    primaryMuscles: ['Biceps Brachii (Long Head / Outer Peak)'],
    secondaryMuscles: ['Brachialis'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Sit on bench angled at 45-60 degrees. Let arms hang straight down behind torso.',
      'Curl dumbbells upward while supinating wrists (turning palms up/outward).',
      'Squeeze peak contraction, then lower slowly to feel full bicep stretch.'
    ],
    benefits: [
      'Places the long head of the bicep on maximal passive stretch behind the body.',
      'Builds the classic tall bicep peak.'
    ],
    tips: [
      'Keep shoulders pinned back into the bench pad at all times.'
    ]
  },
  {
    id: 'arm-03',
    name: 'Dumbbell Hammer Curl',
    muscleGroup: 'Arms',
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Biceps Brachii (Long Head)'],
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Stand holding dumbbells with neutral grip (palms facing each other).',
      'Curl weights upward while keeping palms facing inward throughout.',
      'Squeeze at the top, then lower slowly.'
    ],
    benefits: [
      'Targets the brachialis under the bicep, pushing the bicep up for wider arm appearance.',
      'Develops thick forearm and grip strength.'
    ],
    tips: [
      'Can be performed alternating or both arms together.'
    ]
  },
  {
    id: 'arm-04',
    name: 'Preacher Curl (EZ-Bar)',
    muscleGroup: 'Arms',
    primaryMuscles: ['Biceps Brachii (Short Head / Inner Thickness)'],
    secondaryMuscles: ['Brachialis'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Position armpits snug over top of preacher bench pad.',
      'Grab EZ-bar with inner underhand grip.',
      'Curl bar up toward chin, squeezing hard at top.',
      'Lower carefully until arms are almost fully straight (maintain slight tension to protect tendons).'
    ],
    benefits: [
      'Strict mechanical isolation eliminating all shoulder or momentum cheating.',
      'Maximum inner bicep thickness.'
    ],
    tips: [
      'Do not abruptly slam into lockout at the bottom to protect distal bicep tendon.'
    ]
  },
  {
    id: 'arm-05',
    name: 'EZ-Bar Skull Crushers (Lying Tricep Extension)',
    muscleGroup: 'Arms',
    primaryMuscles: ['Triceps Brachii (Long & Medial Heads)'],
    secondaryMuscles: ['Anconeus'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Lie on flat bench, holding EZ-bar with narrow overhand grip above chest.',
      'Angle upper arms slightly back toward head (10-15 degrees).',
      'Hinge at elbows to lower bar smoothly to forehead or just behind top of head.',
      'Extend elbows powerfully back to starting position.'
    ],
    benefits: [
      'Exceptional stretch and mass builder for the meaty tricep long head.',
      'Directly transfers to barbell bench press lockout power.'
    ],
    tips: [
      'Keep elbows from flaring out excessively to reduce elbow joint torque.'
    ]
  },
  {
    id: 'arm-06',
    name: 'Cable Tricep Rope Pushdown',
    muscleGroup: 'Arms',
    primaryMuscles: ['Triceps Brachii (Lateral & Medial Heads)'],
    secondaryMuscles: ['Anconeus'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Stand facing high cable with rope attachment. Pinned elbows tucked at sides.',
      'Push rope downward, spreading the rope ends apart at the bottom lockout.',
      'Hold full extension contraction for 1 second, then slowly return to 90 degrees.'
    ],
    benefits: [
      'Flared rope finish allows maximum lateral head tricep recruitment (horseshoe shape).',
      'Smooth joint-friendly tension for high volume work.'
    ],
    tips: [
      'Do not let elbows drift forward and backward as you push.'
    ]
  },
  {
    id: 'arm-07',
    name: 'Overhead Cable Tricep Extension',
    muscleGroup: 'Arms',
    primaryMuscles: ['Triceps Brachii (Long Head)'],
    secondaryMuscles: ['Triceps Lateral Head'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Set pulley to mid or high height. Grab rope, turn body facing away, staggered stance.',
      'Lean forward, keeping upper arms elevated beside ears.',
      'Extend forearms forward and overhead, locking out triceps and flaring rope.',
      'Allow rope to return deep behind head for a loaded long-head stretch.'
    ],
    benefits: [
      'Maximizes the stretch of the tricep long head in the overhead shoulder flexed position.',
      'Essential for complete 360 arm diameter.'
    ],
    tips: [
      'Maintain stable core to avoid arching lower spine.'
    ]
  },
  {
    id: 'arm-08',
    name: 'Close-Grip Barbell Bench Press',
    muscleGroup: 'Arms',
    primaryMuscles: ['Triceps Brachii (All Heads)'],
    secondaryMuscles: ['Pectoralis Major (Inner/Mid)', 'Anterior Deltoid'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Lie flat on bench, grip bar with hands shoulder-width apart (do not grip too close to avoid wrist strain).',
      'Lower bar to lower sternum with elbows tucked tightly against ribcage.',
      'Press explosively through palms, driving triceps into hard lockout.'
    ],
    benefits: [
      'Heaviest possible loading overload for tricep muscle fibers.',
      'Directly boosts raw bench press and overhead lockout.'
    ],
    tips: [
      'Keep index fingers around 14-16 inches apart for optimal biomechanics.'
    ]
  },

  // ==========================================
  // LEGS (QUADRICEPS, HAMSTRINGS, GLUTES & CALVES)
  // ==========================================
  {
    id: 'lg-01',
    name: 'Barbell Back Squat',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps (Rectus Femoris, Vastus Lateralis/Medialis)', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Erector Spinae', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Rest barbell securely across upper traps (high bar) or rear delts (low bar).',
      'Set feet shoulder-width apart with toes flared outward 15-30 degrees.',
      'Take a deep belly breath, brace core (valsalva), break at hips and knees simultaneously.',
      'Squat down until hip crease is below the top of the patella (parallel or below).',
      'Drive aggressively through mid-foot to stand up, keeping chest proud.'
    ],
    benefits: [
      'The undisputed king of lower-body strength and overall athletic power.',
      'Recruits maximal muscle fiber volume across the entire body.',
      'Builds dense quadriceps, powerful glutes, and iron core stability.'
    ],
    tips: [
      'Ensure knees track in line with toes throughout the descent and ascent.'
    ]
  },
  {
    id: 'lg-02',
    name: 'Barbell Front Squat',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Upper Back (Thoracic Extensors)', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Rack bar across anterior deltoids in clean grip (fingertips under bar) or cross-arm grip.',
      'Keep elbows high pointing straight forward throughout.',
      'Descend into a deep, upright squat maintaining vertical torso.',
      'Drive straight up out of the hole, keeping elbows elevated.'
    ],
    benefits: [
      'Massive quad isolation due to upright vertical torso angle.',
      'Builds exceptional thoracic spine and core anti-flexion strength.'
    ],
    tips: [
      'If elbows drop, the bar will roll forward off your shoulders.'
    ]
  },
  {
    id: 'lg-03',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Calves'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Stand 2-3 feet in front of a bench. Place top of one foot rearward onto the bench pad.',
      'Hold dumbbells at sides with tall posture.',
      'Lower hips straight down until front thigh is parallel to floor and rear knee hovers above ground.',
      'Drive up through front heel to starting height.'
    ],
    benefits: [
      'Fixes unilateral strength and mobility imbalances.',
      'Huge glute and quad hypertrophy with minimal spinal compression.'
    ],
    tips: [
      'Lean slightly forward to bias glutes; stay upright to bias quads.'
    ]
  },
  {
    id: 'lg-04',
    name: '45-Degree Leg Press',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit in machine with lower back firmly pinned against backrest.',
      'Place feet shoulder-width on sled platform.',
      'Release safety catches and lower sled under control until knees reach 90 degrees or deeper without pelvis lifting.',
      'Press sled up forcefully without locking out knees into hyperextension.'
    ],
    benefits: [
      'Allows extreme quad overload without axial spinal loading.',
      'Safe machine for pushing to absolute muscular failure.'
    ],
    tips: [
      'Never allow your lower back/butt to round off the seat pad (butt wink).'
    ]
  },
  {
    id: 'lg-05',
    name: 'Romanian Deadlift (RDL)',
    muscleGroup: 'Legs',
    primaryMuscles: ['Hamstrings (Biceps Femoris, Semitendinosus)', 'Gluteus Maximus'],
    secondaryMuscles: ['Erector Spinae', 'Lats', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Hold barbell at hips with overhand grip, slight soft bend in knees.',
      'Push hips straight backward as if touching a wall behind you, sliding bar down thighs.',
      'Lower bar until deep hamstring stretch is reached (mid-shin level), keeping spine neutral.',
      'Drive hips forward and squeeze glutes to return to standing lockout.'
    ],
    benefits: [
      'The premier exercise for hamstring hypertrophy in the lengthened position.',
      'Develops unbreakable hip-hinge mechanics for all athletic movements.'
    ],
    tips: [
      'Do not bend knees into a squat; this is a pure hip hinge.'
    ]
  },
  {
    id: 'lg-06',
    name: 'Lying Hamstring Leg Curl',
    muscleGroup: 'Legs',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Gastrocnemius'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Lie face down with roller pad positioned just below calf muscles against Achilles.',
      'Grip machine handles firmly and keep hips pressed into the pad.',
      'Curl heels up toward glutes as far as possible, squeezing hamstrings at peak.',
      'Lower slowly over 3 seconds to full knee extension.'
    ],
    benefits: [
      'Direct knee flexion isolation for hamstrings without lower back fatigue.',
      'Essential for knee joint structural integrity and sprint speed.'
    ],
    tips: [
      'Do not allow hips to hike up off the pad during the curl.'
    ]
  },
  {
    id: 'lg-07',
    name: 'Seated Leg Extension',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps (Rectus Femoris emphasis)'],
    secondaryMuscles: ['None'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Adjust back pad so knees align with machine pivot axis.',
      'Place shin pad across lower front shins.',
      'Extend legs upwards until knees are fully straightened, pausing for 1 second at top.',
      'Lower the weight stack under control.'
    ],
    benefits: [
      'Only exercise that directly loads the rectus femoris in the fully shortened peak position.',
      'Creates supreme quad definition and vascularity.'
    ],
    tips: [
      'Avoid swinging the weight up with jerky momentum.'
    ]
  },
  {
    id: 'lg-08',
    name: 'Barbell Hip Thrust',
    muscleGroup: 'Legs',
    primaryMuscles: ['Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Adductors'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Sit on floor with upper back against bench pad, padded barbell resting across hip crease.',
      'Place feet flat on floor hip-width apart, knees at 90 degrees when elevated.',
      'Drive through heels and extend hips upward until thighs and torso form a straight horizontal line.',
      'Squeeze glutes maximally at top for 1-2 seconds, then lower under control.'
    ],
    benefits: [
      'Highest EMG activation of the gluteus maximus throughout the entire horizontal plane.',
      'Builds explosive hip extension power and sprint acceleration.'
    ],
    tips: [
      'Keep chin tucked toward chest and ribs locked down to prevent lumbar arching.'
    ]
  },
  {
    id: 'lg-09',
    name: 'Standing Calf Raise',
    muscleGroup: 'Legs',
    primaryMuscles: ['Gastrocnemius (Outer & Inner Heads)'],
    secondaryMuscles: ['Soleus'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Place balls of feet on block, shoulder pads resting across upper traps.',
      'Lower heels deeply below platform level to get a full calf stretch (hold 2 seconds).',
      'Drive up explosively onto big toes, squeezing calves at full peak apex.'
    ],
    benefits: [
      'Straight-leg posture isolates the gastrocnemius calf muscle.',
      'Develops diamond-shaped calf definition and ankle stiffness.'
    ],
    tips: [
      'Pause at the bottom stretch to eliminate Achilles elastic rebound.'
    ]
  },
  {
    id: 'lg-10',
    name: 'Seated Calf Raise',
    muscleGroup: 'Legs',
    primaryMuscles: ['Soleus'],
    secondaryMuscles: ['Gastrocnemius'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Sit with thigh pad locked snug over lower quadriceps, balls of feet on step.',
      'Lower heels to full bottom stretch, pause 2 seconds.',
      'Raise heels as high as possible, holding peak for 1 second before descending.'
    ],
    benefits: [
      'Bent knee flexes gastrocnemius, forcing the underlying soleus to do 100% of the work.',
      'Builds lower leg width visible from front and sides.'
    ],
    tips: [
      'Control every rep with a slow 3-second negative.'
    ]
  },
  {
    id: 'lg-11',
    name: 'Walking Dumbbell Lunges',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Endurance',
    instructions: [
      'Hold dumbbells at sides and stand tall.',
      'Step forward with lead leg, sinking hips until both knees form 90-degree angles.',
      'Drive through front heel to step forward directly into next stride with opposite leg.'
    ],
    benefits: [
      'Dynamic unilateral conditioning and functional gait strength.',
      'High caloric expenditure and metabolic conditioning.'
    ],
    tips: [
      'Keep torso upright and do not let lead knee collapse inward.'
    ]
  },
  {
    id: 'lg-12',
    name: 'Hack Squat Machine',
    muscleGroup: 'Legs',
    primaryMuscles: ['Quadriceps (Vastus Lateralis sweep)'],
    secondaryMuscles: ['Glutes'],
    equipment: 'Machine',
    difficulty: 'Intermediate',
    category: 'Hypertrophy',
    instructions: [
      'Step into machine with back against pad, shoulders locked under pads.',
      'Place feet shoulder-width on platform.',
      'Release safety handles and descend deep until thighs meet calves.',
      'Drive through mid-foot to stand, without snapping knees into hyperextension.'
    ],
    benefits: [
      'Creates the coveted outer quad "sweep" without requiring balance.',
      'Massive quad loading under stable guided rail mechanics.'
    ],
    tips: [
      'Place feet slightly lower on platform to increase knee flexion and quad bias.'
    ]
  },

  // ==========================================
  // CORE & ABDOMINALS (STABILIZATION PROTOCOLS)
  // ==========================================
  {
    id: 'co-01',
    name: 'Hanging Leg / Knee Raise',
    muscleGroup: 'Core',
    primaryMuscles: ['Rectus Abdominis (Lower)', 'Hip Flexors'],
    secondaryMuscles: ['Obliques', 'Forearms / Grip'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Hang from pullup bar with overhand grip, shoulders engaged.',
      'Without swinging, roll pelvis upward and raise straight legs (or bent knees) until parallel with floor or higher.',
      'Hold for 1 second at top, then lower under control.'
    ],
    benefits: [
      'Decompresses the spine while firing the entire anterior core.',
      'Builds defined lower abdominal definition and grip endurance.'
    ],
    tips: [
      'Focus on tilting your pelvis toward your chest rather than just swinging your legs.'
    ]
  },
  {
    id: 'co-02',
    name: 'Cable Kneeling Crunch',
    muscleGroup: 'Core',
    primaryMuscles: ['Rectus Abdominis (Upper & Mid)'],
    secondaryMuscles: ['Obliques'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Hypertrophy',
    instructions: [
      'Kneel below high pulley with rope attachment held beside ears.',
      'Lock hips in place and flex spine forward, bringing elbows down toward thighs.',
      'Contract abs aggressively at bottom peak, then return to full upright torso stretch.'
    ],
    benefits: [
      'Allows progressive resistance overload for abdominal hypertrophy (thick 6-pack bricks).',
      'Keeps constant tension throughout full spinal flexion.'
    ],
    tips: [
      'Do not sit back onto heels; keep hips stationary so only the spine flexes.'
    ]
  },
  {
    id: 'co-03',
    name: 'Ab Wheel Rollout',
    muscleGroup: 'Core',
    primaryMuscles: ['Rectus Abdominis (Anti-Extension)', 'Transverse Abdominis'],
    secondaryMuscles: ['Lats', 'Shoulders', 'Chest'],
    equipment: 'Other',
    difficulty: 'Advanced',
    category: 'Strength',
    instructions: [
      'Kneel on floor holding wheel handles directly under shoulders.',
      'Brace core into posterior pelvic tilt (slight rounded hollow back).',
      'Roll wheel forward smoothly as far as you can without letting your lumbar spine sag.',
      'Pull back with abs and lats to return to start.'
    ],
    benefits: [
      'Extreme anti-extension core strength that protects against back pain.',
      'Recruits the deep transverse abdominis corset musculature.'
    ],
    tips: [
      'Never allow your lower back to dip or arch at maximum extension.'
    ]
  },
  {
    id: 'co-04',
    name: 'Cable Woodchopper',
    muscleGroup: 'Core',
    primaryMuscles: ['Internal & External Obliques'],
    secondaryMuscles: ['Transverse Abdominis', 'Shoulders'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    category: 'Functional' as any,
    instructions: [
      'Set cable to high or shoulder height. Stand sideways holding handle with both hands.',
      'Rotate torso downward and across body in a diagonal chopping motion, pivoting back foot.',
      'Return slowly to the starting stretch.'
    ],
    benefits: [
      'Builds rotational kinetic power for swinging, throwing, and athletic strikes.',
      'Chisels diagonal oblique lines.'
    ],
    tips: [
      'Generate the rotation from your core and hips, not your arms.'
    ]
  },
  {
    id: 'co-05',
    name: 'Weighted Plank',
    muscleGroup: 'Core',
    primaryMuscles: ['Transverse Abdominis', 'Rectus Abdominis'],
    secondaryMuscles: ['Glutes', 'Deltoids'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    category: 'Endurance',
    instructions: [
      'Rest on forearms and toes with a weight plate across mid-back if weighted.',
      'Maintain perfectly straight line from head to heels.',
      'Clench glutes and pull belly button up toward spine, holding rigid isometric tension.'
    ],
    benefits: [
      'Isometric bracing foundation for heavy compound squatting and deadlifting.',
      'Improves posture and spinal stiffness.'
    ],
    tips: [
      'Do not let hips sag or hike into a pyramid.'
    ]
  },
  {
    id: 'co-06',
    name: 'Dragon Flag',
    muscleGroup: 'Core',
    primaryMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Lats', 'Hip Flexors'],
    equipment: 'Bodyweight',
    difficulty: 'Elite',
    category: 'Strength',
    instructions: [
      'Lie on bench, grip sides of bench tightly behind head.',
      'Drive entire body vertically straight up in the air, resting only on upper shoulder blades.',
      'Lower straight body slowly in one rigid unit until hovering above bench, then pull back up.'
    ],
    benefits: [
      'The ultimate Bruce Lee calisthenic core strength benchmark.',
      'Unrivaled anti-extension torque.'
    ],
    tips: [
      'Maintain straight line from shoulders to ankles without bending at hips.'
    ]
  },

  // ==========================================
  // OLYMPIC & FUNCTIONAL (KINETIC POWER PROTOCOLS)
  // ==========================================
  {
    id: 'ol-01',
    name: 'Barbell Power Clean',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Trapezius', 'Glutes', 'Hamstrings', 'Quadriceps'],
    secondaryMuscles: ['Forearms', 'Core', 'Deltoids'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    category: 'Power',
    instructions: [
      'Set up in deadlift stance over bar. Pull bar cleanly past knees.',
      'Execute explosive triple extension (hips, knees, ankles) and shrug violently.',
      'Pull body under bar and catch bar in front rack across shoulders with elbows forward, standing to lockout.'
    ],
    benefits: [
      'Highest rate of force development (RFD) of any weight room movement.',
      'Massive athletic vertical jump and sprint power transfer.'
    ],
    tips: [
      'Keep the bar close to your body throughout the entire pull.'
    ]
  },
  {
    id: 'ol-02',
    name: 'Push Press',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Anterior Deltoids', 'Triceps', 'Quadriceps'],
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Power',
    instructions: [
      'Hold bar in front rack across shoulders. Dip knees 3-4 inches with vertical torso.',
      'Explode upward with legs, driving momentum into the barbell.',
      'Finish pressing bar to full overhead lockout as leg drive concludes.'
    ],
    benefits: [
      'Allows handling 15-25% more weight overhead than strict OHP.',
      'Builds kinetic chain linking lower body drive to upper body output.'
    ],
    tips: [
      'Dip straight down smoothly without tipping torso forward.'
    ]
  },
  {
    id: 'ol-03',
    name: 'Kettlebell Snatch',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Hamstrings', 'Glutes', 'Traps', 'Shoulders'],
    secondaryMuscles: ['Core', 'Grip'],
    equipment: 'Kettlebell',
    difficulty: 'Advanced',
    category: 'Power',
    instructions: [
      'Hike kettlebell between legs with one arm.',
      'Drive hips explosively and swing kettlebell upward close to torso.',
      'Punch hand through handle at top apex to catch kettlebell overhead without banging forearm.'
    ],
    benefits: [
      'Explosive hip extension and unilateral overhead stabilization.',
      'High aerobic/anaerobic cardiovascular conditioning.'
    ],
    tips: [
      'Tame the arc: keep kettlebell close to zipper line.'
    ]
  },
  {
    id: 'ol-04',
    name: 'Heavy Farmer\'s Walk',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Trapezius', 'Forearms / Grip', 'Core (Anti-Lateral Flexion)'],
    secondaryMuscles: ['Glutes', 'Calves', 'Quadriceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    category: 'Strength',
    instructions: [
      'Pick up heavy dumbbells, kettlebells, or farmer bars from floor with strict deadlift form.',
      'Stand tall with shoulders pulled down and back, chest proud.',
      'Walk forward with short, deliberate, controlled strides for distance or time.'
    ],
    benefits: [
      'Unbeatable real-world grip strength and trap hypertrophy.',
      'Challenging loaded-carry core stabilization.'
    ],
    tips: [
      'Avoid swaying side to side; keep ribs braced and hips level.'
    ]
  },
  {
    id: 'ol-05',
    name: 'Weighted Sled Push (Prowler)',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Quadriceps', 'Gluteus Maximus', 'Calves'],
    secondaryMuscles: ['Shoulders', 'Triceps', 'Core'],
    equipment: 'Other',
    difficulty: 'Beginner',
    category: 'Endurance',
    instructions: [
      'Grip sled handles with straight arms, torso at 45-degree angle.',
      'Drive through balls of feet, driving knees high and pumping legs continuously forward.',
      'Sprint or march for designated distance.'
    ],
    benefits: [
      'Concentric-only lower body power with zero eccentric muscle damage (fast recovery).',
      'Elite VO2 max and conditioning developer.'
    ],
    tips: [
      'Keep arms extended or tucked tight against handles.'
    ]
  },
  {
    id: 'ol-06',
    name: 'Kettlebell Two-Hand Swings',
    muscleGroup: 'Olympic & Functional',
    primaryMuscles: ['Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Erector Spinae', 'Core', 'Lats'],
    equipment: 'Kettlebell',
    difficulty: 'Beginner',
    category: 'Power',
    instructions: [
      'Hike kettlebell back between legs with both hands, hinging at hips with flat back.',
      'Snap hips forward violently, standing tall and letting kettlebell float up to chest level.',
      'Guide kettlebell back down into hip hinge without squatting.'
    ],
    benefits: [
      'Develops devastating ballistic posterior chain hip power.',
      'Burns visceral body fat rapidly while sparing joint cartilage.'
    ],
    tips: [
      'Do not lift the weight with your front deltoids; all energy comes from hip snap.'
    ]
  }
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest', 
  'Back', 
  'Shoulders', 
  'Arms', 
  'Legs', 
  'Core', 
  'Olympic & Functional'
];

export const EQUIPMENT_TYPES: EquipmentType[] = [
  'Barbell', 
  'Dumbbell', 
  'Cable', 
  'Machine', 
  'Bodyweight', 
  'Kettlebell', 
  'Resistance Band', 
  'Other'
];

export function getExerciseById(id: string): ExerciseDefinition | undefined {
  return EXERCISE_DATABASE.find(e => e.id === id);
}

export function getExercisesByMuscle(group: MuscleGroup): ExerciseDefinition[] {
  return EXERCISE_DATABASE.filter(e => e.muscleGroup === group);
}

export function searchExercises(query: string, filters?: {
  muscleGroup?: MuscleGroup | 'All';
  equipment?: EquipmentType | 'All';
  difficulty?: DifficultyLevel | 'All';
}): ExerciseDefinition[] {
  const clean = query.toLowerCase().trim();
  
  return EXERCISE_DATABASE.filter(ex => {
    // Search query match
    const nameMatch = ex.name.toLowerCase().includes(clean);
    const muscleMatch = ex.primaryMuscles.some(m => m.toLowerCase().includes(clean)) ||
      ex.secondaryMuscles.some(m => m.toLowerCase().includes(clean));
    const groupMatch = ex.muscleGroup.toLowerCase().includes(clean);
    const equipMatch = ex.equipment.toLowerCase().includes(clean);

    if (clean && !nameMatch && !muscleMatch && !groupMatch && !equipMatch) {
      return false;
    }

    // Filter checks
    if (filters?.muscleGroup && filters.muscleGroup !== 'All' && ex.muscleGroup !== filters.muscleGroup) {
      return false;
    }
    if (filters?.equipment && filters.equipment !== 'All' && ex.equipment !== filters.equipment) {
      return false;
    }
    if (filters?.difficulty && filters.difficulty !== 'All' && ex.difficulty !== filters.difficulty) {
      return false;
    }

    return true;
  });
}
