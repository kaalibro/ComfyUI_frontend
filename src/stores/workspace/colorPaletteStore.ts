import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ColorPalettes,
  CompletedPalette,
  Palette
} from '@/types/colorPaletteTypes'
import {
  CORE_COLOR_PALETTES,
  DEFAULT_COLOR_PALETTE
} from '@/constants/coreColorPalettes'

export const useColorPaletteStore = defineStore('colorPalette', () => {
  const customPalettes = ref<ColorPalettes>({})
  const activePaletteId = ref<string>(DEFAULT_COLOR_PALETTE.id)

  const palettesLookup = computed(() => ({
    ...CORE_COLOR_PALETTES,
    ...customPalettes.value
  }))

  const palettes = computed(() => Object.values(palettesLookup.value))
  const completedActivePalette = computed(() =>
    completePalette(palettesLookup.value[activePaletteId.value])
  )

  const addCustomPalette = (palette: Palette) => {
    if (palette.id in palettesLookup.value) {
      throw new Error(`Palette with id ${palette.id} already exists`)
    }

    customPalettes.value[palette.id] = palette
    activePaletteId.value = palette.id
  }

  const deleteCustomPalette = (id: string) => {
    if (!(id in customPalettes.value)) {
      throw new Error(`Palette with id ${id} does not exist`)
    }

    delete customPalettes.value[id]
    activePaletteId.value = CORE_COLOR_PALETTES.dark.id
  }

  const isCustomPalette = (id: string) => {
    return id in customPalettes.value
  }

  /**
   * Completes the palette with default values for missing colors.
   *
   * @param palette - The palette to complete.
   * @returns The completed palette.
   */
  const completePalette = (palette: Palette): CompletedPalette => {
    // Set comfy-menu-secondary-bg to comfy-menu-bg if not set
    if (
      palette.colors.comfy_base['comfy-menu-bg'] &&
      !palette.colors.comfy_base['comfy-menu-secondary-bg']
    ) {
      palette.colors.comfy_base['comfy-menu-secondary-bg'] =
        palette.colors.comfy_base['comfy-menu-bg']
    }

    return {
      ...palette,
      colors: {
        ...palette.colors,
        node_slot: {
          ...DEFAULT_COLOR_PALETTE.colors.node_slot,
          ...palette.colors.node_slot
        },
        litegraph_base: {
          ...DEFAULT_COLOR_PALETTE.colors.litegraph_base,
          ...palette.colors.litegraph_base
        },
        comfy_base: {
          ...DEFAULT_COLOR_PALETTE.colors.comfy_base,
          ...palette.colors.comfy_base
        }
      }
    }
  }

  return {
    // State
    customPalettes,
    activePaletteId,

    // Getters
    palettesLookup,
    palettes,
    completedActivePalette,

    // Actions
    isCustomPalette,
    addCustomPalette,
    deleteCustomPalette,
    completePalette
  }
})