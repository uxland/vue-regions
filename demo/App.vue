<template>
  <region-holder></region-holder>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { region } from '../src/region-decorator';
import { IRegion } from '@uxland/regions';
import RegionHolder from './RegionHolder.vue';

@Component({ components: { RegionHolder } })
export default class DemoApp extends Vue {}
</script>
