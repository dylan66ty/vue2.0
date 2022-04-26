export default {
  name: 'router-link',
  functional: true,
  render(h, context) {
    const props = context.props
    const tag = props.tag || 'a'
    const to = props.to
    const onClickHander = () => {
      context.parent.$router.push(to)
    }

    return h(tag, { on: { click: onClickHander } }, [context.slots().default])
  }

}