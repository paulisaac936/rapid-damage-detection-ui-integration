# ChangeFormer Improvements TODO

## Phase 1: Critical Bug Fixes
- [ ] Fix hardcoded embed_dims in EncoderTransformer.forward_features()
- [ ] Add missing os import in main_cd.py
- [ ] Fix inconsistent tensor operations (.size() vs .shape)

## Phase 2: Training Enhancements
- [ ] Add Mixed Precision Training (AMP) support
- [ ] Add Gradient Accumulation support
- [ ] Add Early Stopping
- [ ] Add Model Exponential Moving Average (EMA)
- [ ] Add Learning Rate Warmup
- [ ] Add Cosine Annealing scheduler

## Phase 3: Performance Improvements
- [ ] Optimize data loading (increase num_workers)
- [ ] Add Gradient Checkpointing for memory efficiency
- [ ] Add Test-Time Augmentation (TTA)

## Phase 4: Code Quality
- [ ] Add Type Hints
- [ ] Add Docstrings
- [ ] Refactor duplicated code in decoders
- [ ] Add proper error handling

## Phase 5: Logging & Monitoring
- [ ] Add TensorBoard support
- [ ] Add more detailed metrics logging
- [ ] Add GPU memory monitoring

## Phase 6: Features
- [ ] Add validation frequency control
- [ ] Add checkpoint frequency control
- [ ] Add training resume from best checkpoint
- [ ] Add multi-scale inference option

## Implementation Priority:
1. Critical bug fixes
2. Training enhancements (biggest impact on training)
3. Code quality
4. Performance improvements
5. Logging & monitoring
6. Additional features
