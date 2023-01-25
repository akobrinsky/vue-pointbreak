/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import {
  describe, it, vi, expect, type SpyInstance,
} from 'vitest';
import pointbreak, { TAILWIND_BREAKPOINTS, usePointbreak } from '@/lib';

const optionsApiComponent = defineComponent({
  inject: ['pointbreak'],
  data() {
    return {
      something: 'foo',
    };
  },
  created() {
    if (this.pointbreak) this.dummyMethod('from created');
  },
  mounted() {
    if (this.pointbreak) this.dummyMethod('from mounted');
  },
  methods: {
    dummyMethod(val: string): string {
      return `HUZZAH ${val}!!!`;
    },
  },
  template: '<div />',
});

const compApiComponent = defineComponent({
  setup: () => ({ pointbreak: usePointbreak() }),

  created() {
    if (this.pointbreak) this.dummyMethod('from created');
  },
  mounted() {
    if (this.pointbreak) this.dummyMethod('from mounted');
  },
  methods: {
    dummyMethod(val: string): string {
      return `HUZZAH ${val}!!!`;
    },
  },
  template: '<div />',
});

const setup = (compApi = false) => {
  const componentToMount = compApi ? compApiComponent : optionsApiComponent;
  const wrapper: VueWrapper<
    InstanceType<typeof componentToMount> & { [key: string]: any }
  > = mount(compApi ? compApiComponent : optionsApiComponent, {
    global: {
      plugins: [
        [pointbreak, { breakpoints: TAILWIND_BREAKPOINTS, inclusive: false }],
      ],
    },
  });
  return wrapper;
};

describe('pointbreak', () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(TAILWIND_BREAKPOINTS)) {
    it(`Picks the ${key} breakpoint`, async () => {
      window.resizeTo(value || 500, 900);
      const wrapper = setup();
      expect(wrapper.vm.something).toBe('foo');
      expect(wrapper.vm.pointbreak[key]).toBe(true);
    });
  }

  it('No value is true if the viewport width is invalid', async () => {
    window.resizeTo(-100, 900);
    const wrapper = setup();
    // eslint-disable-next-line no-restricted-syntax
    for (const breakpoint of Object.keys(TAILWIND_BREAKPOINTS)) {
      expect(wrapper.vm.pointbreak[breakpoint]).toBe(false);
    }
  });

  const assertDummyMethods = (spy: SpyInstance) => {
    expect(spy).toHaveBeenCalledWith('from created');
    expect(spy).toHaveBeenCalledWith('from mounted');
    expect(spy.mock.results.length).toBe(2);
    expect(spy.mock.results[0].value).toBe('HUZZAH from created!!!');
  };

  it('it is available in both mounted and created lifecycle hooks', async () => {
    window.resizeTo(1000, 900);
    const optionsApiMethodsSpy = vi.spyOn(
      optionsApiComponent.methods!,
      'dummyMethod',
    );
    const { vm } = setup();
    expect(vm.pointbreak).toBeDefined();
    expect(optionsApiComponent.inject).toEqual(['pointbreak']);
    expect(optionsApiComponent.setup).toBeUndefined();
    assertDummyMethods(optionsApiMethodsSpy);
  });

  it('it is available in setup with composition api by using usePointbreak', async () => {
    const compositionApiMethodsSpy = vi.spyOn(
      compApiComponent.methods!,
      'dummyMethod',
    );
    const { vm } = setup(true);
    expect(vm.pointbreak).toBeDefined();
    expect(compApiComponent.setup).toBeDefined();
    expect(compApiComponent.inject).toBeUndefined();
    assertDummyMethods(compositionApiMethodsSpy);
  });
});
