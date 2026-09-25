import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StatusBadge from '../StatusBadge.vue'
import { STATUSES } from '@/stores/applications'

describe('StatusBadge', () => {
  it('renders the status text', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'zusage' } })

    expect(wrapper.text()).toBe('zusage')
  })

  it('adds a status-specific CSS class', () => {
    const wrapper = mount(StatusBadge, { props: { status: 'zusage' } })

    expect(wrapper.classes()).toContain('status-badge')
    expect(wrapper.classes()).toContain('status-badge--zusage')
  })

  it.each(STATUSES)('renders every status (%s)', (status) => {
    const wrapper = mount(StatusBadge, { props: { status } })

    expect(wrapper.text()).toBe(status)
    expect(wrapper.classes()).toContain(`status-badge--${status}`)
  })
})
