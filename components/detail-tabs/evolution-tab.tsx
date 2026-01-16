import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EvolutionCard } from '@/components/evolution-card';
import { useThemedColors } from '@/hooks/use-themed-tokens';
import { extractIdFromUrl } from '@/lib/api/pokemon';
import type { ChainLink } from '@/lib/api/types';

interface EvolutionTabProps {
  chain: ChainLink;
}

interface EvolutionStage {
  id: number;
  name: string;
}

function flattenEvolutionChain(chain: ChainLink): EvolutionStage[] {
  const stages: EvolutionStage[] = [];

  function traverse(link: ChainLink) {
    const id = extractIdFromUrl(link.species.url);
    stages.push({ id, name: link.species.name });

    for (const evolution of link.evolves_to) {
      traverse(evolution);
    }
  }

  traverse(chain);
  return stages;
}

export function EvolutionTab({ chain }: EvolutionTabProps) {
  const router = useRouter();
  const colors = useThemedColors();
  const stages = flattenEvolutionChain(chain);

  const handlePress = useCallback(
    (id: number) => {
      router.push(`/pokemon/${id}`);
    },
    [router]
  );

  return (
    <View style={styles.container}>
      {stages.map((stage, index) => (
        <View key={stage.id}>
          <EvolutionCard
            id={stage.id}
            name={stage.name}
            onPress={() => handlePress(stage.id)}
          />
          {index < stages.length - 1 && (
            <View style={styles.connector}>
              <View style={[styles.line, { backgroundColor: colors.midnight }]} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  connector: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  line: {
    width: 2,
    height: 14,
    opacity: 0.2,
    borderRadius: 1,
  },
});
