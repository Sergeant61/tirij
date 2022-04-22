ActionGetPlan = function (link) {
  const { slug } = link;

  if (slug === 'free') {
    return {
      type: 'free',
    }
  }

  let plan = Plans.findOne({ slug: slug, }, { sort: { createdAt: -1 } });

  if (!plan) {
    const _id = Plans.insert({ slug: slug, type: 'forever' })
    plan = Plans.findOne({ _id: _id, }, { sort: { createdAt: -1 } });
  }

  return plan
}