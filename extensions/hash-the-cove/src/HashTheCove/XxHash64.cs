// XXH64 streaming implementation for seed 0, adapted from xxHash v0.8.3:
// https://github.com/Cyan4973/xxHash/blob/v0.8.3/xxhash.h
//
// xxHash Library
// Copyright (c) 2012-2021 Yann Collet
// All rights reserved.
//
// BSD 2-Clause License
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice, this
//   list of conditions and the following disclaimer in the documentation and/or
//   other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

using System.Buffers.Binary;

namespace HashTheCove;

internal sealed class XxHash64
{
    private const ulong Prime1 = 11400714785074694791UL;
    private const ulong Prime2 = 14029467366897019727UL;
    private const ulong Prime3 = 1609587929392839161UL;
    private const ulong Prime4 = 9650029242287828579UL;
    private const ulong Prime5 = 2870177450012600261UL;

    private readonly byte[] _buffer = new byte[32];
    private ulong _v1 = unchecked(Prime1 + Prime2);
    private ulong _v2 = Prime2;
    private ulong _v3;
    private ulong _v4 = unchecked(0UL - Prime1);
    private ulong _length;
    private int _bufferLength;

    public void Append(ReadOnlySpan<byte> input)
    {
        _length += (ulong)input.Length;
        if (_bufferLength + input.Length < 32)
        {
            input.CopyTo(_buffer.AsSpan(_bufferLength));
            _bufferLength += input.Length;
            return;
        }

        if (_bufferLength > 0)
        {
            var needed = 32 - _bufferLength;
            input[..needed].CopyTo(_buffer.AsSpan(_bufferLength));
            ProcessBlock(_buffer);
            input = input[needed..];
            _bufferLength = 0;
        }

        while (input.Length >= 32)
        {
            ProcessBlock(input[..32]);
            input = input[32..];
        }

        input.CopyTo(_buffer);
        _bufferLength = input.Length;
    }

    public string GetHexDigest()
    {
        ulong hash;
        if (_length >= 32)
        {
            hash = RotateLeft(_v1, 1) + RotateLeft(_v2, 7) + RotateLeft(_v3, 12) + RotateLeft(_v4, 18);
            hash = MergeRound(hash, _v1);
            hash = MergeRound(hash, _v2);
            hash = MergeRound(hash, _v3);
            hash = MergeRound(hash, _v4);
        }
        else
        {
            hash = Prime5;
        }

        hash += _length;
        var remaining = _buffer.AsSpan(0, _bufferLength);
        while (remaining.Length >= 8)
        {
            var lane = Round(0, BinaryPrimitives.ReadUInt64LittleEndian(remaining));
            hash ^= lane;
            hash = RotateLeft(hash, 27) * Prime1 + Prime4;
            remaining = remaining[8..];
        }

        if (remaining.Length >= 4)
        {
            hash ^= BinaryPrimitives.ReadUInt32LittleEndian(remaining) * Prime1;
            hash = RotateLeft(hash, 23) * Prime2 + Prime3;
            remaining = remaining[4..];
        }

        foreach (var value in remaining)
        {
            hash ^= value * Prime5;
            hash = RotateLeft(hash, 11) * Prime1;
        }

        hash ^= hash >> 33;
        hash *= Prime2;
        hash ^= hash >> 29;
        hash *= Prime3;
        hash ^= hash >> 32;
        return hash.ToString("x16");
    }

    private void ProcessBlock(ReadOnlySpan<byte> block)
    {
        _v1 = Round(_v1, BinaryPrimitives.ReadUInt64LittleEndian(block));
        _v2 = Round(_v2, BinaryPrimitives.ReadUInt64LittleEndian(block[8..]));
        _v3 = Round(_v3, BinaryPrimitives.ReadUInt64LittleEndian(block[16..]));
        _v4 = Round(_v4, BinaryPrimitives.ReadUInt64LittleEndian(block[24..]));
    }

    private static ulong Round(ulong accumulator, ulong input)
    {
        accumulator += input * Prime2;
        accumulator = RotateLeft(accumulator, 31);
        return accumulator * Prime1;
    }

    private static ulong MergeRound(ulong accumulator, ulong value)
    {
        accumulator ^= Round(0, value);
        return accumulator * Prime1 + Prime4;
    }

    private static ulong RotateLeft(ulong value, int count) =>
        (value << count) | (value >> (64 - count));
}
