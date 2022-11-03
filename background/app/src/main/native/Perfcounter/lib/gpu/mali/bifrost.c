/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "hpc/gpu/mali/bifrost.h"

#include <assert.h>
#include <stdint.h>

#include "context.h"

static uint32_t hpc_gpu_mali_bifrost_counter_convert(
    uint32_t counter, hpc_gpu_mali_counter_layout_t layout);

int hpc_gpu_mali_bifrost_create_context(
    uint32_t num_counters, hpc_gpu_mali_bifrost_counter_t *counters,
    const hpc_gpu_host_allocation_callbacks_t *allocator,
    hpc_gpu_mali_context_t **out_context) {
  return hpc_gpu_mali_create_context(num_counters, counters,
                                     hpc_gpu_mali_bifrost_counter_convert,
                                     allocator, out_context);
}

int hpc_gpu_mali_bifrost_destroy_context(
    hpc_gpu_mali_context_t *context,
    const hpc_gpu_host_allocation_callbacks_t *allocator) {
  return hpc_gpu_mali_destroy_context(context, allocator);
}

int hpc_gpu_mali_bifrost_start_counters(const hpc_gpu_mali_context_t *context) {
  return hpc_gpu_mali_context_start_counters(context);
}

int hpc_gpu_mali_bifrost_stop_counters(const hpc_gpu_mali_context_t *context) {
  return hpc_gpu_mali_context_stop_counters(context);
}

int hpc_gpu_mali_bifrost_query_counters(const hpc_gpu_mali_context_t *context,
                                        uint64_t *values) {
  return hpc_gpu_mali_context_query_counters(context, values);
}

//===-------------- BEGIN AUTOGENERATED REGION; DO NOT EDIT! --------------===//

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_tmix(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_thex(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_tdvx(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_tsix(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_tgox(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static inline uint32_t hpc_gpu_mali_bifrost_counter_convert_to_tnox(
    uint32_t counter) {
  return counter & ((1u << 8u) - 1u);
}

static uint32_t hpc_gpu_mali_bifrost_counter_convert(
    uint32_t counter, hpc_gpu_mali_counter_layout_t layout) {
  // clang-format off
  switch (layout) {
    case HPC_GPU_MALI_COUNTER_LAYOUT_TMIX: return hpc_gpu_mali_bifrost_counter_convert_to_tmix(counter);
    case HPC_GPU_MALI_COUNTER_LAYOUT_THEX: return hpc_gpu_mali_bifrost_counter_convert_to_thex(counter);
    case HPC_GPU_MALI_COUNTER_LAYOUT_TDVX: return hpc_gpu_mali_bifrost_counter_convert_to_tdvx(counter);
    case HPC_GPU_MALI_COUNTER_LAYOUT_TSIX: return hpc_gpu_mali_bifrost_counter_convert_to_tsix(counter);
    case HPC_GPU_MALI_COUNTER_LAYOUT_TGOX: return hpc_gpu_mali_bifrost_counter_convert_to_tgox(counter);
    case HPC_GPU_MALI_COUNTER_LAYOUT_TNOX: return hpc_gpu_mali_bifrost_counter_convert_to_tnox(counter);
    default: assert(0 && "should not happen!"); return ~0u;
  }
  // clang-format on
}

//===--------------- END AUTOGENERATED REGION; DO NOT EDIT! ---------------===//