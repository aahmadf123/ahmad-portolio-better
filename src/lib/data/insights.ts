// Technical insights — code-aesthetic perspective cards. Takeaways are lifted from
// the projects' own "Key Insight" prose; snippets are short illustrative sketches
// of the described mechanism (labeled as such in the UI), not production excerpts.

export interface Insight {
  id: string;
  title: string;
  lang: 'python' | 'sql' | 'ts';
  file: string;
  code: string;
  takeaway: string;
  source: { label: string; href: string };
  color: string;
}

export const insights: Insight[] = [
  {
    id: 'reward-shaping',
    title: 'Reward functions encode behavior',
    lang: 'python',
    file: 'deepflyer/rewards/path_efficiency.py',
    code: `def path_efficiency_reward(state, action, prev):
    r = 0.0
    r += 4.0 * state.hoop_progress          # pull toward the hoop
    r -= 0.8 * state.path_deviation         # stay on the racing line
    r -= 6.0 * float(state.collision)       # raise this → drone gets cautious
    r -= 0.05                               # time pressure: hesitation costs
    if state.hoop_cleared:
        r += 25.0                           # the moment worth learning
    return r`,
    takeaway:
      'Reward functions are not just math — they encode behavior. A student who increases the collision penalty and watches the drone become more conservative has understood something no lecture can teach as directly.',
    source: { label: 'DeepFlyer · LION Lab', href: '/case-study/deepflyer-drone-reinforcement-learning' },
    color: '#5b8af5',
  },
  {
    id: 'hitl-gates',
    title: 'Move humans to the right point in the loop',
    lang: 'python',
    file: 'ml_automation/dags/promote_model.py',
    code: `with DAG("model_promotion") as dag:
    drift    = detect_drift(baseline, live_window)
    retrain  = retrain_if(drift.score > THRESHOLD)
    evaluate = compare(retrain.model, production.model)

    # automation with accountability, not without it
    approval = SlackApprovalGate(
        to="actuarial-review",
        context=[drift.report, evaluate.shap_summary],
    )
    promote  = deploy(evaluate.winner, after=approval)`,
    takeaway:
      'The 75% reduction in manual review did not happen because humans were removed. The system moved them to the right point in the loop — intervening only where judgment actually matters: drift, suspicious behavior, rollback, promotion.',
    source: { label: 'Homeowner Loss Prediction · Grange Insurance', href: '/case-study/homeowner-loss-prediction' },
    color: '#a78bfa',
  },
  {
    id: 'graph-navigation',
    title: 'Navigation is a relational problem',
    lang: 'python',
    file: 'aerosynapse/world/graph_encoder.py',
    code: `def encode(observation) -> EnvGraph:
    g = EnvGraph()
    for obj in observation.segments():
        node = g.add(obj.kind, obj.position)   # obstacle | waypoint | free-space
    for a, b in g.pairs():
        g.connect(a, b,
            risk=collision_risk(a, b),
            cost=traversal_cost(a, b))
    # the policy reasons over relationships, not pixels
    return g`,
    takeaway:
      'A flat perception model sees objects — a graph sees relationships between obstacles, goals, risk, and motion constraints. That structural representation is what makes zero-shot generalization tractable.',
    source: { label: 'Graph-Based RL for UAV Autonomy', href: '/case-study/graph-based-rl-uav-autonomy' },
    color: '#f59e0b',
  },
  {
    id: 'schema-security',
    title: 'A validated schema is a security control',
    lang: 'sql',
    file: 'sdt/schema/ingest_constraints.sql',
    code: `CREATE TABLE endpoint_inventory (
  host_id      text PRIMARY KEY,
  source       text NOT NULL
               CHECK (source IN ('ad','cisco_amp','defender')),
  hostname     text NOT NULL CHECK (hostname ~ '^[a-z0-9\\-\\.]+$'),
  last_seen    timestamptz NOT NULL,
  -- three tools, one boundary: disagreement fails loudly here
  CONSTRAINT fresh CHECK (last_seen > now() - interval '90 days')
);`,
    takeaway:
      'Most data-quality problems in security ops are not adversarial — they are inconsistent tooling assumptions meeting at a shared data boundary. Validation rules caught 95% of non-compliant entries at ingestion.',
    source: { label: 'Security Discovery Tool · Park Place', href: '/case-study/security-discovery-tool' },
    color: '#2dd4bf',
  },
  {
    id: 'correction-flywheel',
    title: 'The correction flywheel is the moat',
    lang: 'sql',
    file: 'football_iq/schema/coach_corrections.sql',
    code: `CREATE TABLE coach_corrections (
  id            bigserial PRIMARY KEY,
  label_id      bigint REFERENCES labels(id),
  corrected_by  text NOT NULL,           -- the coach, not the model
  old_value     jsonb NOT NULL,
  new_value     jsonb NOT NULL,
  clip_id       bigint REFERENCES clips(id),
  -- every correction becomes Toledo-specific training data
  exported_to_dataset boolean DEFAULT false
);`,
    takeaway:
      'Correction workflows must be built before advanced models. Private, corrected, domain-specific data beats any off-the-shelf model at Toledo football terminology — the flywheel is the competitive advantage.',
    source: { label: 'Toledo Football IQ', href: '/case-study/toledo-football-iq-computer-vision-analytics' },
    color: '#ef4444',
  },
];
